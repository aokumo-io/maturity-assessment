import React, { ReactNode } from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  tabs?: {
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }[];
  hideSidebar?: boolean;
  classHeader?: string;
  isHideScollbar?: boolean;
  element?: React.JSX.Element;
}

export function AppLayout({ 
  children, 
  title, 
  subtitle, 
  actions, 
  tabs, 
  hideSidebar = false,
  classHeader,
  isHideScollbar = false,
  element
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      {!hideSidebar && <Sidebar className="min-h-screen" />}

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${element ? 'bg-gray-50' : ''}`}>
        {/* Header */}
        <Header
          classHeader={classHeader}
          title={title}
          subtitle={subtitle}
          actions={actions}
          tabs={tabs}
        />
        {element ? (
          element
        ) : (
          <></>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 overflow-auto bg-gray-50 ${isHideScollbar ? 'hide-scrollbar' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
