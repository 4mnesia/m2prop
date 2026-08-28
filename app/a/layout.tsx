import ComparatorBar from "../_components/ComparatorBar";
import ControlBar from "../_components/ControlBar";

export default function MicrositioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ControlBar />
      {children}
      <ComparatorBar />
    </>
  );
}
