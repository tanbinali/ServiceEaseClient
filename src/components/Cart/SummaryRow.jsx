export const SummaryRow = ({ label, value, icon, bold }) => (
  <div
    className={`flex justify-between items-center ${bold ? "font-bold" : ""}`}
  >
    <span className="text-base-content/60 flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span className="font-semibold">{value}</span>
  </div>
);
