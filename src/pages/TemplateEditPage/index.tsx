import { useParams } from 'react-router-dom';

const TemplateEditPage = () => {
    const { id } = useParams(); // URL의 :id 값

    return (
        <div>{id}</div>
    );
};

export default TemplateEditPage;
