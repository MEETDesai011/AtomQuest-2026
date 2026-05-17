export const StatusBadge = ({ status }) => {
  const CONFIG = {
    DRAFT:       { cls: 'badge-draft',     label: 'Draft'       },
    SUBMITTED:   { cls: 'badge-submitted', label: 'Submitted'   },
    APPROVED:    { cls: 'badge-approved',  label: 'Approved'    },
    REWORK:      { cls: 'badge-rework',    label: 'Rework'      },
    ESCALATION:  { cls: 'badge-escalation',label: 'Escalation'  },
    NOT_STARTED: { cls: 'badge-draft',     label: 'Not Started' },
    ON_TRACK:    { cls: 'badge-submitted', label: 'On Track'    },
    COMPLETED:   { cls: 'badge-approved',  label: 'Completed'   },
    BLOCKED:     { cls: 'badge-rework',    label: 'Blocked'     },
  };

  const config = CONFIG[status] || { cls: 'badge-draft', label: status?.replace(/_/g, ' ') };

  return (
    <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
      text-[11px] font-semibold tracking-wide
      ${config.cls}
    `}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {config.label}
    </span>
  );
};
