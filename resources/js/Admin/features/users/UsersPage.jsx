import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import UsersFilterBar from './components/UsersFilterBar';
import UsersTable from './components/UsersTable';
import UserDrawer from './components/UserDrawer';
import UserActionModal from './components/UserActionModal';
import useDrawer from '../../hooks/useDrawer';
import useModal from '../../hooks/useModal';
import { asArray, normalizeUser, paginator } from '../../../utils/pageData';

export default function UsersPage() {
  const { props } = usePage();
  const drawer = useDrawer();
  const modal = useModal();
  const [actionType, setActionType] = useState('warn');
  const users = asArray(props.users).map((user) => {
    const normalized = normalizeUser(user);
    return {
      ...normalized,
      typeColor: normalized.type === 'owner' ? 'info' : 'primary',
      statusColor: normalized.status === 'active' ? 'success' : normalized.status === 'banned' ? 'danger' : 'warning',
      ops: user.rentals_as_tenant_count ?? user.rentals_as_owner_count ?? user.ops ?? 0,
    };
  });

  const openActionModal = (user, type) => {
    modal.open(user);
    setActionType(type);
    drawer.close();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <UsersFilterBar />
      <UsersTable users={users} pagination={paginator(props.users)} onOpenDrawer={drawer.open} onOpenActionModal={openActionModal} />
      <UserDrawer isOpen={drawer.isOpen} user={drawer.selectedItem} onClose={drawer.close} onOpenActionModal={openActionModal} />
      <UserActionModal isOpen={modal.isOpen} user={modal.selectedItem} actionType={actionType} setActionType={setActionType} onClose={modal.close} />
    </div>
  );
}
