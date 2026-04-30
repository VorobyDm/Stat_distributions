import type { DistributionConfig } from "../types";

interface Props {
  items: DistributionConfig[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function DistributionNav({ items, activeId, onSelect }: Props) {
  return (
    <nav>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px 16px",
            border: "none",
            background: item.id === activeId ? "var(--color-bg-brand)" : "transparent",
            color: item.id === activeId ? "#fff" : "inherit",
            textAlign: "left",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {item.name}
        </button>
      ))}
    </nav>
  );
}
