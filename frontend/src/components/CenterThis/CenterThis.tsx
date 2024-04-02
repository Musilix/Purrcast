export default function CenterThis({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="center-content-wrap"
      className="flex flex-col w-full h-full items-center place-content-center *:p-2"
    >
      {children}
    </div>
  );
}
