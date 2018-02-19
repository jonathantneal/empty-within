export default function emptyWithin(scope, opts) {
	/* Update elements on input change
	/* ====================================================================== */

	const {
		attr = 'empty-within',
		className = '',
		watchScope = true,
		watchValue = true
	} = Object(opts);

	const emptyInputs = [];

	function onInputChange(event) {
		// determine if the target’s empty state has changed
		let element = event.target;
		const emptyIndex = emptyInputs.indexOf(element);
		const notEmptyIsNowEmpty = emptyIndex === -1 && !element.value;
		const emptyisNowNotEmpty = emptyIndex !== -1 && element.value;

		if (notEmptyIsNowEmpty) {
			// add the target to the list of empty elements
			emptyInputs.push(element);

			// update elements from the target to the scope
			while (element && scope.contains(element)) {
				if (attr) {
					element.setAttribute(attr, '');
				}

				if (className) {
					element.classList.add(className);
				}

				element = element.parentElement;
			}
		} else if (emptyisNowNotEmpty) {
			// remove the target from the list of empty elements
			emptyInputs.splice(emptyIndex, 1);

			// update elements from the target to the scope
			while (element && scope.contains(element) && emptyInputs.every(
				// or until another empty element affects the tree
				emptyInput => !element.contains(emptyInput)
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

	/* Update elements when the plugin is initialized and the document is ready
	/* ====================================================================== */

	function onInitialized() {
		scope.addEventListener('input', onInputChange);

		function withTarget(target) {
			if (target.nodeName === 'INPUT' || target.nodeName === 'TEXTAREA') {
				onInputChange({ target });

				if (watchValue) {
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

							onInputChange({ target });
						}
					};

					Object.defineProperty(target, 'value', descriptor);
				}
			}
		}

		[].forEach.call(scope.querySelectorAll('input,textarea'), withTarget);

		// watch for and update any new text fields
		if (watchScope) {
			new MutationObserver(
				mutations => mutations.forEach(
					mutation => [].filter.call(mutation.addedNodes || []).forEach(withTarget)
				)
			).observe(scope, {
				childList: true
			});
		}
	}

	/* Watch the document for any interactive state
	/* ====================================================================== */

	const document = scope.ownerDocument || scope;

	/* eslint-disable */
	!function onDocumentInteractive() {
		if (/i|c/.test(document.readyState)) {
			document.removeEventListener('readystatechange', onDocumentInteractive) | onInitialized();
		} else {
			document.addEventListener('readystatechange', onDocumentInteractive);
		}
	}()
	/* eslint-enable */
}
