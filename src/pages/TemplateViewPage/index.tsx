// import { useParams } from 'react-router-dom';
import ViewHeader from "./components/ViewHeader";
import TemplateView from "./components/TemplateView";

const TemplateViewPage = () => {
    // const { id } = useParams(); // URL의 :id 값

    return (
        <div className="min-h-screen flex justify-center items-center">
            <ViewHeader onClickDownload={() => console.log('png 다운')} />
            <div className="pt-[76px] flex justify-center items-center gap-2 flex-[1_0_0] self-stretch bg-[#E5E5E5]">
                <TemplateView />
            </div>
        </div>
    );
};

export default TemplateViewPage;
