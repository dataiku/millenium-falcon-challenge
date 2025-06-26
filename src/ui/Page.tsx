import styles from './Page.module.css';

export const Page = ({
  children,
  title,
  className,
}: React.PropsWithChildren<{ title: string; className?: string }>) => {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>{title}</h1>
        <div className={[styles.content, className].join(' ')}>{children}</div>
      </main>
    </div>
  );
};
