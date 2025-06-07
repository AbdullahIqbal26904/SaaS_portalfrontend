import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

const ShareableInvite = () => {
  const [showModal, setShowModal] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { user } = useSelector((state) => state.auth);
  const { selectedReseller } = useSelector((state) => state.resellers);

  useEffect(() => {
    if (user?.is_reseller_admin && user?.reseller_id) {
      generateInviteLink(user.reseller_id);
    } else if (selectedReseller?.reseller_id) {
      generateInviteLink(selectedReseller.reseller_id);
    }
  }, [user, selectedReseller]);

  const generateInviteLink = (resellerId) => {
    // Base URL (adjust based on environment)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const link = `${baseUrl}/?reseller_id=${resellerId}`;
    setInviteLink(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink + (companyName ? `&company_name=${encodeURIComponent(companyName)}` : ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Button 
        onClick={() => setShowModal(true)}
        className="mr-4"
      >
        Generate Invite Link
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Generate Customer Invite Link"
      >
        <div className="p-4">
          <p className="mb-4 text-sm text-gray-600">
            Share this link with your customers to allow them to register directly under your reseller account.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter customer company name"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="mt-1 text-xs text-gray-500">
              Adding a company name will pre-fill the customer's department name
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invite Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={inviteLink + (companyName ? `&company_name=${encodeURIComponent(companyName)}` : '')}
                readOnly
                className="flex-grow p-2 border border-gray-300 rounded-l-md bg-gray-50"
              />
              <button
                onClick={handleCopy}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setShowModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShareableInvite;
