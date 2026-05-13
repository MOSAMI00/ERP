const fs = require('fs');
const path = require('path');

const resourcesJs = path.join(__dirname, 'resources', 'js');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.js') || f.endsWith('.jsx') || f.endsWith('.ts') || f.endsWith('.tsx')) {
      callback(dirPath);
    }
  });
}

// 1. Replace Link, useNavigate, useLocation imports and Link "to" props
walkDir(resourcesJs, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // React Router Dom -> @inertiajs/react imports
  if (content.includes('react-router-dom')) {
    content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
      changed = true;
      let newImports = imports
        .split(',')
        .map(i => i.trim())
        .map(i => {
          if (i === 'useNavigate') return 'router';
          if (i === 'useLocation') return 'usePage';
          return i;
        })
        .filter(i => i !== 'Outlet' && i !== 'Navigate') // Remove router specific ones
        .join(', ');
      
      return `import { ${newImports} } from '@inertiajs/react';`;
    });
  }

  // <Link to="..." -> <Link href="..."
  if (content.match(/<Link[^>]*\sto=/)) {
    content = content.replace(/(<Link[^>]*?)\sto=/g, '$1 href=');
    changed = true;
  }
  
  if (content.match(/<Navigate\s+to=/)) {
    // Navigate component was used for redirects, replacing with router.visit inside useEffect might be needed,
    // but typically it's handled via inertia redirects from backend. Let's leave Navigate alone or replace it later if needed.
  }

  // Layout injection for pages
  if (filePath.includes(path.join('resources', 'js', 'pages'))) {
    const isOwner = filePath.includes(path.join('pages', 'Owner'));
    const isTenant = filePath.includes(path.join('pages', 'Tenant'));
    const isPage = filePath.endsWith('Page.jsx') || filePath.endsWith('Page.tsx') || filePath.endsWith('Overview.jsx');
    
    if ((isOwner || isTenant) && isPage) {
      // Need to add layout definition.
      // First, find the default export name
      const defaultExportMatch = content.match(/export\s+default\s+(?:function\s+)?([A-Za-z0-9_]+)/);
      let pageComponentName = null;
      if (defaultExportMatch) {
        pageComponentName = defaultExportMatch[1];
      } else {
        const arrowFuncExportMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*(?:(?:\([^)]*\))|(?:[^=]*))\s*=>/);
        if (arrowFuncExportMatch && content.includes(`export default ${arrowFuncExportMatch[1]}`)) {
          pageComponentName = arrowFuncExportMatch[1];
        }
      }

      if (pageComponentName && !content.includes(`${pageComponentName}.layout =`)) {
        let layoutName = isOwner ? 'OwnerLayout' : 'TenantLayout';
        let layoutPath = isOwner ? '@/layouts/owner/OwnerLayout' : '@/layouts/tenant/TenantLayout';
        
        // Add layout import if not present
        if (!content.includes(layoutName)) {
           // compute relative path or use alias if configured. Let's use relative path.
           // Since files are like resources/js/pages/Owner/Overview/OverviewPage.jsx
           // and layout is resources/js/layouts/owner/OwnerLayout.jsx
           const relativeLayoutPath = isOwner ? '../../../layouts/owner/OwnerLayout' : '../../../layouts/tenant/TenantLayout';
           content = `import ${layoutName} from '${relativeLayoutPath}';\n` + content;
        }

        // Append layout definition
        content += `\n${pageComponentName}.layout = page => <${layoutName}>{page}</${layoutName}>;\n`;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Modified:', filePath);
  }
});
