export const CartBadge = ({ icon: Icon, label, value }) => (
  <div className="badge badge-lg gap-2">
    {Icon && <Icon />}
    {label ? `${label}: ${value}` : value}
  </div>
);
