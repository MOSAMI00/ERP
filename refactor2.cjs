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

walkDir(resourcesJs, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const normalizedPath = filePath.replace(/\\/g, '/');

  // Layout injection for pages
  if (normalizedPath.toLowerCase().includes('/resources/js/pages/')) {
    const isOwner = normalizedPath.toLowerCase().includes('/pages/owner/');
    const isTenant = normalizedPath.toLowerCase().includes('/pages/tenant/');
    const isPage = filePath.endsWith('Page.jsx') || filePath.endsWith('Page.tsx') || filePath.endsWith('OverviewPage.jsx');
    
    if ((isOwner || isTenant) && isPage) {
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
        
        // Find how many directories deep we are from Pages to compute relative path to layouts.
        // resources/js/Pages/Owner/AddEquipment/AddEquipmentPage.jsx -> layouts is in resources/js/layouts
        // distance: 3 directories up from AddEquipment.
        // Actually it's easier to just use relative paths manually if we know the depth or use absolute alias if we can.
        // The project has `vite.config.js` and `ReactRouterApp.jsx`, typically Laravel uses `@` alias for `resources/js` or no alias and we have to use `../../../layouts...`. Let's assume `../../../layouts/` for Tenant/X/Y.jsx.
        // Wait, Owner/Overview/OverviewPage.jsx is 3 levels deep from Pages. resources/js/layouts is sibling of Pages.
        // So from Owner/Overview to layouts: `../../../layouts/owner/OwnerLayout`
        
        const relativeLayoutPath = isOwner ? '../../../layouts/owner/OwnerLayout' : '../../../layouts/tenant/TenantLayout';

        if (!content.includes(layoutName)) {
           content = `import ${layoutName} from '${relativeLayoutPath}';\n` + content;
        }

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
