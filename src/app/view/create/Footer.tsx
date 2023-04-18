import "../../style/create/Footer.scss";

type CreateFooterProps = {
    disabled: boolean;
    onClick: () => void;
};

export default function CreateFooter({ onClick, disabled }: CreateFooterProps) {
    return (
        <div className="create-footer">
            <button
                type="reset"
                className="create-footer-reset-button"
                disabled={disabled}
            >
                Reset
            </button>
            <button
                className="create-footer-submit-button"
                type="submit"
                disabled={disabled}
                onClick={onClick}
            >
                Submit
            </button>
        </div>
    );
}
