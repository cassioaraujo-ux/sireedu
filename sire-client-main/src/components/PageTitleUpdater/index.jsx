import { useEffect } from "react";

const PageTitleUpdater = ({ title }) => {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
};

export default PageTitleUpdater;