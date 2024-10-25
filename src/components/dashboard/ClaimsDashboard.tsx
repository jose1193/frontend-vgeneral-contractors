import React from "react";

interface ClaimData {
  id: number;
  dateReported: Date;
  customerName: string;
  propertyAddress: string;
  damageType: string;
  estimatedCost: number;
  status: string;
  assignedTechnician: string;
  insuranceProvider: string;
}

const sampleData: ClaimData[] = [
  {
    id: 1,
    dateReported: new Date("2024-07-01"),
    customerName: "John Doe",
    propertyAddress: "123 Main St, Anytown, USA",
    damageType: "Water Damage",
    estimatedCost: 5000,
    status: "In Progress",
    assignedTechnician: "Mike Smith",
    insuranceProvider: "ABC Insurance",
  },
  {
    id: 2,
    dateReported: new Date("2024-07-02"),
    customerName: "Jane Smith",
    propertyAddress: "456 Oak Rd, Othertown, USA",
    damageType: "Fire Damage",
    estimatedCost: 15000,
    status: "Pending",
    assignedTechnician: "Sarah Johnson",
    insuranceProvider: "XYZ Insurance",
  },
  {
    id: 3,
    dateReported: new Date("2024-07-03"),
    customerName: "Bob Brown",
    propertyAddress: "789 Pine Ave, Somewhere, USA",
    damageType: "Mold Remediation",
    estimatedCost: 3000,
    status: "Completed",
    assignedTechnician: "Tom Wilson",
    insuranceProvider: "DEF Insurance",
  },
];

const StatusChip = ({ status }: { status: string }) => {
  let colorClass = "";
  switch (status) {
    case "Completed":
      colorClass = "bg-green-500";
      break;
    case "In Progress":
      colorClass = "bg-yellow-500";
      break;
    case "Pending":
      colorClass = "bg-gray-500";
      break;
    default:
      colorClass = "bg-gray-500";
  }

  return (
    <span className={`px-2 py-1 rounded-full text-white text-sm ${colorClass}`}>
      {status}
    </span>
  );
};

function ClaimsReport() {
  return (
    <div
      className="p-6 mb-10 h-[400px] rounded-lg shadow-xl overflow-hidden w-full overflow-x-auto max-w-[88vw] lg:max-w-[88vw] md:max-w-[79vw] sm:max-w-[68vw]"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="border-b border-white/20">
              <th className="py-3 px-4 text-left">Claim ID</th>
              <th className="py-3 px-4 text-left">Date Reported</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Property Address</th>
              <th className="py-3 px-4 text-left">Damage Type</th>
              <th className="py-3 px-4 text-left">Estimated Cost</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Assigned Technician</th>
              <th className="py-3 px-4 text-left">Insurance Provider</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-white/10 hover:bg-white/5"
              >
                <td className="py-3 px-4">{row.id}</td>
                <td className="py-3 px-4">
                  {row.dateReported.toLocaleDateString()}
                </td>
                <td className="py-3 px-4">{row.customerName}</td>
                <td className="py-3 px-4">{row.propertyAddress}</td>
                <td className="py-3 px-4">{row.damageType}</td>
                <td className="py-3 px-4">
                  ${row.estimatedCost.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <StatusChip status={row.status} />
                </td>
                <td className="py-3 px-4">{row.assignedTechnician}</td>
                <td className="py-3 px-4">{row.insuranceProvider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClaimsReport;
