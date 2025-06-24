export const Code = ({ children }: { children: unknown }) => (
  <pre>
    <code>{JSON.stringify(children, null, 2)}</code>
  </pre>
);
