export default function IconSourceHint({ className = '' }) {
  return (
    <p className={`text-[10px] text-outline mt-1 ${className}`}>
      Find an icon on{' '}
      <a
        href="https://fonts.google.com/icons"
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-primary underline hover:text-on-primary-container"
      >
        Google Fonts Icons
      </a>
      , then paste its name here.
    </p>
  );
}
