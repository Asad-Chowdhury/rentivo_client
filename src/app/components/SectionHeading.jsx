import Link from "next/link";

const SectionHeading = ({ title, description, actionHref, actionLabel }) => {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-normal">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70">
            {description}
          </p>
        ) : null}
      </div>

      {actionHref && actionLabel ? (
        <Link href={actionHref} className="btn btn-outline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};

export default SectionHeading;
