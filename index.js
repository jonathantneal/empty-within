export default function emptyWithin(document, opts) {
	const { className = '', attr = 'empty-within' } = Object(opts);
	const emptyInputs = [];

	function oninputchange(event) {
		let element = event.target;
		const emptyIndex = emptyInputs.indexOf(element);

		if (emptyIndex === -1 && !element.value) {
			// if a non-empty input is now empty
			emptyInputs.push(element);

			while (element) {
				if (attr) {
					element.setAttribute(attr, '');
				}

				if (className) {
					element.classList.add(className);
				}

				element = element.parentElement;
			}
		} else if (emptyIndex !== -1 && element.value) {
			// if an empty input has gained a value
			emptyInputs.splice(emptyIndex, 1);

			while (element && emptyInputs.every(
				emptyInput => !element.contains(emptyInput) // eslint-disable-line no-loop-func
			)) {
				if (attr) {
					element.removeAttribute(attr);
				}

				if (className) {
					element.classList.remove(className);
				}

				element = element.parentElement;
			}
		}
	}

	function initialize() {
		document.addEventListener('input', oninputchange);

		function withTarget(target) {
			if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') {
				oninputchange({ target });

				const descriptor = {
					enumerable: true,
					configurable: true,
					get() {
						delete target.value;

						const value = target.value;

						Object.defineProperty(target, 'value', descriptor);

						return value;
					},
					set(value) {
						delete target.value;

						target.value = value;

						Object.defineProperty(target, 'value', descriptor);

						oninputchange({ target });
					}
				};

				Object.defineProperty(target, 'value', descriptor);
			}
		}

		[].forEach.call(document.querySelectorAll('input,textarea'), withTarget);

		// watch for and update any new text fields
		new MutationObserver(
			mutations => mutations.forEach(
				mutation => [].filter.call(mutation.addedNodes || []).forEach(withTarget)
			)
		).observe(document, {
			childList: true
		});
	}

	/**
	 * Callback wrapper for check loaded state
	 */
	/* eslint-disable */
	!function load() {
		if (/i|c/.test(document.readyState)) {
			document.removeEventListener('readystatechange', load) | initialize();
		} else {
			document.addEventListener('readystatechange', load);
		}
	}()
	/* eslint-enable */
}
