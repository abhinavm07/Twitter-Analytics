export default function Modal({context, close}) {

    const {
        title, body, footer = null
    } = context;

    return (
        <div className='modal-container'>
            <div className='my-modal'>
                <div className='my-modal-content'>
                    <div className='my-modal-header'>
                        <h3 className='my-modal-title'>{title}</h3>
                        <button className='my-modal-close' onClick={close}>X</button>
                    </div>
                    <div className='my-modal-body'>
                        {body}
                    </div>
                    {footer && <div className='my-modal-footer'>
                        {footer}
                    </div>}
                </div>
            </div>
        </div>
    )
}