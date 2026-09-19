import OfcTwHeader from "@/components/solutions/OfcTwHeader";
import SpatialFooter from "@/components/layout/SpatialFooter";
import RequestDemoArea from "./RequestDemoArea";

const RequestDemo = () => {
  return (
    <div className="ofc-tw spatial-page oc-request-demo-page">
      <OfcTwHeader activeHref="/request-demo/" />
      <main>
        <RequestDemoArea />
      </main>
      <SpatialFooter />
    </div>
  );
};

export default RequestDemo;
