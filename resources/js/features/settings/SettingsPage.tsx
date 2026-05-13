import React, { useState } from "react";
import { User, Shield, CreditCard, Bell } from "lucide-react";
import { usePage } from '@inertiajs/react';
import { PageHeader } from "../../components/shared";
import { getSettingsConfig } from "./lib/settingsConfig";

// Tenant Forms
import { ProfileForm } from "./ui/ProfileForm";
import { SecurityForm } from "./ui/SecurityForm";
import { KYCUploaders } from "./ui/KYCUploaders";

// Owner Forms
import { OwnerProfileForm } from "./ui/OwnerProfileForm";

const ICONS = {
  User: <User size={18} />,
  Shield: <Shield size={18} />,
  CreditCard: <CreditCard size={18} />,
  Bell: <Bell size={18} />,
};

export default function SettingsPage({ role: roleProp }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const role = roleProp || user?.type || "tenant";
  const config = getSettingsConfig(role);
  const [activeTab, setActiveTab] = useState(config.tabs[0].id);

  const renderContent = () => {
    if (role === "owner") {
      switch (activeTab) {
        case "profile":
          return <OwnerProfileForm />;
        case "security":
          return <SecurityForm />;
        case "kyc":
          return <KYCUploaders />;
        default:
          return null;
      }
    } else {
      switch (activeTab) {
        case "profile":
          return <ProfileForm />;
        case "security":
          return <SecurityForm />;
        case "kyc":
          return <KYCUploaders />;
        default:
          return null;
      }
    }
  };

  return (
    <div
      className="p-4 md:p-6 pb-24 md:pb-6"
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <PageHeader title={config.pageTitle} />

      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <div className="flex gap-2 overflow-x-auto rounded-2xl border border-[#E8ECEF] bg-white p-2 shadow-sm lg:sticky lg:top-6 lg:flex-col lg:overflow-visible">
            {config.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-w-12 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-all whitespace-nowrap lg:w-full lg:justify-start ${
                  activeTab === tab.id
                    ? "bg-[#2D5A27] text-white shadow-sm"
                    : "text-[#666666] hover:bg-[#F4F6F9] hover:text-[#222222]"
                }`}
              >
                {ICONS[tab.iconName]}
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 w-full bg-white rounded-2xl border border-[#E0E0E0] p-5 md:p-8 shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
