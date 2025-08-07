import { useParams } from 'react-router-dom';

const TemplateViewPage = () => {
    const { id } = useParams(); // URL의 :id 값

    return (
        <div>{id}</div>
    );
};

export default TemplateViewPage;
