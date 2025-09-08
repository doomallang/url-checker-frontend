import React from "react";
import { useUptime } from "@/hooks/useUptime";
import ControlBar from "@/components/uptime/ControlBar";
import StatCards from "@/components/uptime/StatCards";
import LatencyChart from "@/components/uptime/LatencyChart";
import ResultTable from "@/components/uptime/ResultTable";
import UpsertModal from "@/components/uptime/UpsertModal";

export default function UptimeDashboard() {
  const vm = useUptime();

  return (
    <div className="min-h-screen bg-gray-50">
      {vm.polling && (
        <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-50 text-indigo-700 ml-4 mt-2 inline-block">
          auto refresh
        </span>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <header className="relative mb-6">
          <div className="absolute inset-x-0 -top-6 h-24 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl -z-10" />
          <ControlBar
            checks={vm.checks}
            selectedId={vm.selectedId}
            onChangeSelected={vm.setSelectedId}
            onRefresh={vm.reloadSelected}
            onCreate={vm.openCreate}
            onEdit={vm.openEdit}
            onToggle={vm.toggleEnabled}
            onDelete={vm.remove}
            selected={vm.selected}
          />
        </header>
        {vm.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {vm.error}
          </div>
        )}
        <StatCards summary1h={vm.summary1h} summary24h={vm.summary24h} />
        <LatencyChart data={vm.chartData} loading={vm.loading} />
        <ResultTable rows={vm.recent} />
        <UpsertModal
          open={vm.modalOpen}
          onClose={() => vm.setModalOpen(false)}
          editingId={vm.editingId}
          form={vm.form}
          setForm={vm.setForm}
          onSubmit={vm.submitUpsert}
        />
      </div>
    </div>
  );
}
