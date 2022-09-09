export function isHidden ($elem: HTMLElement): boolean {
	return $elem.hasAttribute("hidden")
		|| ($elem.hasAttribute("aria-hidden") && $elem.getAttribute("aria-hidden") !== "false")

		|| $elem.style.display === `none`
		|| $elem.style.opacity === `0`
		|| $elem.style.visibility === `hidden`
		|| $elem.style.visibility === `collapse`;

}

/**
 * @param $elem
 */
export function isDisabled ($elem: HTMLElement): boolean {
	return $elem.hasAttribute("disabled")
		|| ($elem.hasAttribute("aria-disabled") && $elem.getAttribute("aria-disabled") !== "false");
}

/**
 * @param $elem
 */
export function isFocusable ($elem: HTMLElement): boolean {


	if ($elem.getAttribute("tabindex") === "-1" || isHidden($elem) || isDisabled($elem)) {
		return false;
	}

	return (

		$elem.hasAttribute("tabindex")

		|| ($elem instanceof HTMLAnchorElement || $elem instanceof HTMLAreaElement) && $elem.hasAttribute("href")

		|| ($elem instanceof HTMLButtonElement
			|| $elem instanceof HTMLInputElement
			|| $elem instanceof HTMLTextAreaElement
			|| $elem instanceof HTMLSelectElement)

		|| $elem instanceof HTMLIFrameElement
	);
}