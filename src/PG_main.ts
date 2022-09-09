export function queryShadowRoot (root: ShadowRoot | HTMLElement,
   skipNode: (($elem: HTMLElement) => boolean),
   isMatch: (($elem: HTMLElement) => boolean),
   maxDepth: number = 20,
   depth: number = 0): HTMLElement[] {
let matches: HTMLElement[] = [];


if (depth >= maxDepth) {
return matches;
}


const traverseSlot = ($slot: HTMLSlotElement) => {


const assignedNodes = $slot.assignedNodes().filter(node => node.nodeType === 1);
if (assignedNodes.length > 0) {
const $slotParent = assignedNodes[0].parentElement!;
return queryShadowRoot($slotParent, skipNode, isMatch, maxDepth, depth + 1);
}

return [];
};


const children = <HTMLElement[]>Array.from(root.children || []);
for (const $child of children) {


if (skipNode($child)) {
continue;
}

if (isMatch($child)) {
matches.push($child);
}

if ($child.shadowRoot != null) {


matches.push(...queryShadowRoot($child.shadowRoot, skipNode, isMatch, maxDepth, depth + 1));

} else if ($child.tagName === "SLOT") {


matches.push(...traverseSlot(<HTMLSlotElement>$child));

} else {


matches.push(...queryShadowRoot($child, skipNode, isMatch, maxDepth, depth + 1));
}
}

return matches;
}
const template = document.createElement("template");
template.innerHTML = `
	<div id="start"></div>
	<div id="backup"></div>
	<slot></slot>
	<div id="end"></div>
`;

/**
 * @customElement focus-trap
 * @slot - Default content.
 */
export class FocusTrap extends HTMLElement implements IFocusTrap {


	static get observedAttributes () {
		return [
			"inactive"
		];
	}

	/**
	 * @attr
	 */
	get inactive () {
		return this.hasAttribute("inactive");
	}

	set inactive (value: boolean) {
		value ? this.setAttribute("inactive", "") : this.removeAttribute("inactive");
	}


	private $backup!: HTMLElement;


	private debounceId = Math.random().toString();

	private $start!: HTMLElement;
	private $end!: HTMLElement;


	get focused (): boolean {
		return this._focused;
	}


	constructor () {
		super();

		const shadow = this.attachShadow({mode: "open"});
		shadow.appendChild(template.content.cloneNode(true));

		this.$backup = shadow.querySelector<HTMLElement>("#backup")!;
		this.$start = shadow.querySelector<HTMLElement>("#start")!;
		this.$end = shadow.querySelector<HTMLElement>("#end")!;

		this.focusLastElement = this.focusLastElement.bind(this);
		this.focusFirstElement = this.focusFirstElement.bind(this);
		this.onFocusIn = this.onFocusIn.bind(this);
		this.onFocusOut = this.onFocusOut.bind(this);
	}


	connectedCallback () {
		this.$start.addEventListener("focus", this.focusLastElement);
		this.$end.addEventListener("focus", this.focusFirstElement);

		this.addEventListener("focusin", this.onFocusIn);
		this.addEventListener("focusout", this.onFocusOut);

		this.render();
	}



	disconnectedCallback () {
		this.$start.removeEventListener("focus", this.focusLastElement);
		this.$end.removeEventListener("focus", this.focusFirstElement);
		this.removeEventListener("focusin", this.onFocusIn);
		this.removeEventListener("focusout", this.onFocusOut);
	}


	attributeChangedCallback () {
		this.render();
	}


	focusFirstElement () {
		this.trapFocus();
	}


	focusLastElement () {
		this.trapFocus(true);
	}


	getFocusableElements (): HTMLElement[] {
		return queryShadowRoot(this, isHidden, isFocusable);
	}

	/**

	 * @param {boolean} trapToEnd
	 */
	protected trapFocus (trapToEnd?: boolean) {
		if (this.inactive) return;

		let focusableElements = this.getFocusableElements();
		if (focusableElements.length > 0) {
			if (trapToEnd) {
				focusableElements[focusableElements.length - 1].focus();
			} else {
				focusableElements[0].focus();
			}

			this.$backup.setAttribute("tabindex", "-1");
		} else {
			this.$backup.setAttribute("tabindex", "0");
			this.$backup.focus();
		}
	}

	private onFocusIn () {
		this.updateFocused(true);
	}


	private onFocusOut () {
		this.updateFocused(false);
	}

	/**
	 * @param value
	 */
	private updateFocused (value: boolean) {
		debounce(() => {
			if (this.focused !== value) {
				this._focused = value;
				this.render();
			}
		}, 0, this.debounceId);
	}


	protected render () {
		this.$start.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
		this.$end.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
		this.focused ? this.setAttribute("focused", "") : this.removeAttribute("focused");
	}
}

window.customElements.define("focus-trap", FocusTrap);