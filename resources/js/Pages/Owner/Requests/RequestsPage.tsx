import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { usePage, router } from '@inertiajs/react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import { PageHeader } from '../../../components/shared';
import AcceptRequestModal from './components/AcceptRequestModal';
import RequestDetailsModal from './components/RequestDetailsModal';
import RequestFilters from './components/RequestFilters';
import RequestGrid from './components/RequestGrid';
import RequestTabs from './components/RequestTabs';
import RejectRequestModal from './components/RejectRequestModal';
import { useOwnerRequests } from './useOwnerRequests';

const Requests = () => {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const { rentals } = useOwnerPageProps();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const { selectedRental, tabs, visibleRentals } = useOwnerRequests({
    rentals,
    ownerId: user?.id,
    activeTab,
    search,
    selectedRentalId,
  });

  const openModal = (type, rentalId) => {
    if (!rentalId) return;
    setSelectedRentalId(rentalId);
    setModal(type);
  };

  const closeModal = () => setModal(null);

  const confirmApprove = () => {
    if (!selectedRental?.id) return;
    router.post(`/rentals/${selectedRental.id}/confirm`, {}, {
      onSuccess: () => {
        toast.success('تم قبول الطلب وإشعار المستأجر لإتمام الدفع');
        closeModal();
      },
    });
  };

  const confirmReject = (reason = 'Rejected by owner') => {
    if (!selectedRental?.id) return;
    router.post(`/rentals/${selectedRental.id}/cancel`, {
      cancellation_reason: reason,
    }, {
      onSuccess: () => {
        toast.success('تم رفض الطلب وإشعار المستأجر');
        closeModal();
      },
    });
  };

  return (
    <div>
      <PageHeader
        title="الطلبات الواردة"
        actions={<RequestFilters search={search} onSearchChange={setSearch} />}
      />

      <RequestTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <RequestGrid
        isLoading={isLoading}
        rentals={visibleRentals}
        search={search}
        onOpenModal={openModal}
      />

      <AcceptRequestModal
        isOpen={modal === 'acceptReview' && Boolean(selectedRental)}
        rental={selectedRental}
        onClose={closeModal}
        onConfirm={confirmApprove}
      />

      <RejectRequestModal
        isOpen={modal === 'reject' && Boolean(selectedRental)}
        onClose={closeModal}
        onConfirm={confirmReject}
      />

      <RequestDetailsModal
        isOpen={modal === 'detail' && Boolean(selectedRental)}
        rental={selectedRental}
        onClose={closeModal}
      />
    </div>
  );
};

export default Requests;

Requests.layout = page => <OwnerLayout>{page}</OwnerLayout>;
