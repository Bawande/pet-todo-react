import React from "react";
import { useContext } from "react";
import { InterfaceContext } from "../../contexts/interface";

const PopUp = ({ closePopup, title, children }) => {
	const [objectInterfaceState, dispatchInterfaceState] = useContext(InterfaceContext);

	const handlerKeydown = (event) => {
		if (event.code === 'Escape') {
			window.removeEventListener('keydown', handlerKeydown);
			dispatchInterfaceState({
				type: closePopup
			});
		} else {
			setTimeout(() => {
				window.removeEventListener('keydown', handlerKeydown);
			}, 5000);
		}
	}

	window.addEventListener('keydown', handlerKeydown);

	return (
		<div className="pop-up__wrapper">
			<div className="pop-up">
				<h3 className="pop-up__title">{title}</h3>
				<button
					className="pop-up__btn-close btn-nav btn-nav__close"
					onClick={() => dispatchInterfaceState({ type: `${closePopup}` })}
				></button>
				{children}
			</div>
		</div>

	)
}

export default PopUp;