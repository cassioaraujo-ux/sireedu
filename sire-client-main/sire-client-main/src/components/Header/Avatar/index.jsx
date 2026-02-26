import "./styles.css";

const Avatar = ({ name }) => {

    return (
        <div className="avatar-container">
            { name[0] }
        </div>
    );
}

export default Avatar;