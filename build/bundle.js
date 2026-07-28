(function() {
	//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) __defProp(target, name, {
			get: all[name],
			enumerable: true
		});
		if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
		return target;
	};
	//#endregion
	//#region node_modules/svelte/src/internal/shared/utils.js
	var is_array = Array.isArray;
	var index_of = Array.prototype.indexOf;
	var includes = Array.prototype.includes;
	var array_from = Array.from;
	var define_property = Object.defineProperty;
	var get_descriptor = Object.getOwnPropertyDescriptor;
	var object_prototype = Object.prototype;
	var array_prototype = Array.prototype;
	var get_prototype_of = Object.getPrototypeOf;
	var is_extensible = Object.isExtensible;
	var noop = () => {};
	/** @param {Array<() => void>} arr */
	function run_all(arr) {
		for (var i = 0; i < arr.length; i++) arr[i]();
	}
	/**
	* TODO replace with Promise.withResolvers once supported widely enough
	* @template [T=void]
	*/
	function deferred() {
		/** @type {(value: T) => void} */
		var resolve;
		/** @type {(reason: any) => void} */
		var reject;
		return {
			promise: new Promise((res, rej) => {
				resolve = res;
				reject = rej;
			}),
			resolve,
			reject
		};
	}
	var CLEAN = 1024;
	var DIRTY = 2048;
	var MAYBE_DIRTY = 4096;
	var INERT = 8192;
	var DESTROYED = 16384;
	/** Set once a reaction has run for the first time */
	var REACTION_RAN = 32768;
	/** Effect is in the process of getting destroyed. Can be observed in child teardown functions */
	var DESTROYING = 1 << 25;
	/**
	* 'Transparent' effects do not create a transition boundary.
	* This is on a block effect 99% of the time but may also be on a branch effect if its parent block effect was pruned
	*/
	var EFFECT_TRANSPARENT = 65536;
	var EFFECT_PRESERVED = 1 << 19;
	var USER_EFFECT = 1 << 20;
	var EFFECT_OFFSCREEN = 1 << 25;
	/**
	* Tells that we marked this derived and its reactions as visited during the "mark as (maybe) dirty"-phase.
	* Will be lifted during execution of the derived and during checking its dirty state (both are necessary
	* because a derived might be checked but not executed). This is a pure performance optimization flag and
	* should not be used for any other purpose!
	*/
	var WAS_MARKED = 65536;
	var REACTION_IS_UPDATING = 1 << 21;
	var ASYNC = 1 << 22;
	var ERROR_VALUE = 1 << 23;
	var STATE_SYMBOL = Symbol("$state");
	var LEGACY_PROPS = Symbol("legacy props");
	var ATTRIBUTES_CACHE = Symbol("attributes");
	var CLASS_CACHE = Symbol("class");
	var STYLE_CACHE = Symbol("style");
	var TEXT_CACHE = Symbol("text");
	/** allow users to ignore aborted signal errors if `reason.name === 'StaleReactionError` */
	var STALE_REACTION = new class StaleReactionError extends Error {
		name = "StaleReactionError";
		message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
	}();
	globalThis.document?.contentType;
	//#endregion
	//#region node_modules/svelte/src/internal/client/errors.js
	/**
	* Cannot create a `$derived(...)` with an `await` expression outside of an effect tree
	* @returns {never}
	*/
	function async_derived_orphan() {
		throw new Error(`https://svelte.dev/e/async_derived_orphan`);
	}
	/**
	* Keyed each block has duplicate key `%value%` at indexes %a% and %b%
	* @param {string} a
	* @param {string} b
	* @param {string | undefined | null} [value]
	* @returns {never}
	*/
	function each_key_duplicate(a, b, value) {
		throw new Error(`https://svelte.dev/e/each_key_duplicate`);
	}
	/**
	* `%rune%` cannot be used inside an effect cleanup function
	* @param {string} rune
	* @returns {never}
	*/
	function effect_in_teardown(rune) {
		throw new Error(`https://svelte.dev/e/effect_in_teardown`);
	}
	/**
	* Effect cannot be created inside a `$derived` value that was not itself created inside an effect
	* @returns {never}
	*/
	function effect_in_unowned_derived() {
		throw new Error(`https://svelte.dev/e/effect_in_unowned_derived`);
	}
	/**
	* `%rune%` can only be used inside an effect (e.g. during component initialisation)
	* @param {string} rune
	* @returns {never}
	*/
	function effect_orphan(rune) {
		throw new Error(`https://svelte.dev/e/effect_orphan`);
	}
	/**
	* Maximum update depth exceeded. This typically indicates that an effect reads and writes the same piece of state
	* @returns {never}
	*/
	function effect_update_depth_exceeded() {
		throw new Error(`https://svelte.dev/e/effect_update_depth_exceeded`);
	}
	/**
	* Cannot do `bind:%key%={undefined}` when `%key%` has a fallback value
	* @param {string} key
	* @returns {never}
	*/
	function props_invalid_value(key) {
		throw new Error(`https://svelte.dev/e/props_invalid_value`);
	}
	/**
	* Property descriptors defined on `$state` objects must contain `value` and always be `enumerable`, `configurable` and `writable`.
	* @returns {never}
	*/
	function state_descriptors_fixed() {
		throw new Error(`https://svelte.dev/e/state_descriptors_fixed`);
	}
	/**
	* Cannot set prototype of `$state` object
	* @returns {never}
	*/
	function state_prototype_fixed() {
		throw new Error(`https://svelte.dev/e/state_prototype_fixed`);
	}
	/**
	* Updating state inside `$derived(...)`, `$inspect(...)` or a template expression is forbidden. If the value should not be reactive, declare it without `$state`
	* @returns {never}
	*/
	function state_unsafe_mutation() {
		throw new Error(`https://svelte.dev/e/state_unsafe_mutation`);
	}
	/**
	* A `<svelte:boundary>` `reset` function cannot be called while an error is still being handled
	* @returns {never}
	*/
	function svelte_boundary_reset_onerror() {
		throw new Error(`https://svelte.dev/e/svelte_boundary_reset_onerror`);
	}
	//#endregion
	//#region node_modules/svelte/src/constants.js
	var HYDRATION_ERROR = {};
	var UNINITIALIZED = Symbol("uninitialized");
	/**
	* Reading a derived belonging to a now-destroyed effect may result in stale values
	*/
	function derived_inert() {
		console.warn(`https://svelte.dev/e/derived_inert`);
	}
	/**
	* Hydration failed because the initial UI does not match what was rendered on the server. The error occurred near %location%
	* @param {string | undefined | null} [location]
	*/
	function hydration_mismatch(location) {
		console.warn(`https://svelte.dev/e/hydration_mismatch`);
	}
	/**
	* A `<svelte:boundary>` `reset` function only resets the boundary the first time it is called
	*/
	function svelte_boundary_reset_noop() {
		console.warn(`https://svelte.dev/e/svelte_boundary_reset_noop`);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/hydration.js
	/** @import { TemplateNode } from '#client' */
	/**
	* Use this variable to guard everything related to hydration code so it can be treeshaken out
	* if the user doesn't use the `hydrate` method and these code paths are therefore not needed.
	*/
	var hydrating = false;
	/** @param {boolean} value */
	function set_hydrating(value) {
		hydrating = value;
	}
	/**
	* The node that is currently being hydrated. This starts out as the first node inside the opening
	* <!--[--> comment, and updates each time a component calls `$.child(...)` or `$.sibling(...)`.
	* When entering a block (e.g. `{#if ...}`), `hydrate_node` is the block opening comment; by the
	* time we leave the block it is the closing comment, which serves as the block's anchor.
	* @type {TemplateNode}
	*/
	var hydrate_node;
	/** @param {TemplateNode | null} node */
	function set_hydrate_node(node) {
		if (node === null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		return hydrate_node = node;
	}
	function hydrate_next() {
		return set_hydrate_node(/* @__PURE__ */ get_next_sibling(hydrate_node));
	}
	/** @param {TemplateNode} node */
	function reset(node) {
		if (!hydrating) return;
		if (/* @__PURE__ */ get_next_sibling(hydrate_node) !== null) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		hydrate_node = node;
	}
	function next(count = 1) {
		if (hydrating) {
			var i = count;
			var node = hydrate_node;
			while (i--) node = /* @__PURE__ */ get_next_sibling(node);
			hydrate_node = node;
		}
	}
	/**
	* Skips or removes (depending on {@link remove}) all nodes starting at `hydrate_node` up until the next hydration end comment
	* @param {boolean} remove
	*/
	function skip_nodes(remove = true) {
		var depth = 0;
		var node = hydrate_node;
		while (true) {
			if (node.nodeType === 8) {
				var data = node.data;
				if (data === "]") {
					if (depth === 0) return node;
					depth -= 1;
				} else if (data === "[" || data === "[!" || data[0] === "[" && !isNaN(Number(data.slice(1)))) depth += 1;
			}
			var next = /* @__PURE__ */ get_next_sibling(node);
			if (remove) node.remove();
			node = next;
		}
	}
	/**
	*
	* @param {TemplateNode} node
	*/
	function read_hydration_instruction(node) {
		if (!node || node.nodeType !== 8) {
			hydration_mismatch();
			throw HYDRATION_ERROR;
		}
		return node.data;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/equality.js
	/** @import { Equals } from '#client' */
	/** @type {Equals} */
	function equals(value) {
		return value === this.v;
	}
	/**
	* @param {unknown} a
	* @param {unknown} b
	* @returns {boolean}
	*/
	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || a !== null && typeof a === "object" || typeof a === "function";
	}
	/** @type {Equals} */
	function safe_equals(value) {
		return !safe_not_equal(value, this.v);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/flags/index.js
	/** True if experimental.async=true */
	var async_mode_flag = false;
	/** True if we're not certain that we only have Svelte 5 code in the compilation */
	var legacy_mode_flag = false;
	//#endregion
	//#region node_modules/svelte/src/internal/client/context.js
	/** @import { ComponentContext, DevStackEntry, Effect } from '#client' */
	/** @type {ComponentContext | null} */
	var component_context = null;
	/** @param {ComponentContext | null} context */
	function set_component_context(context) {
		component_context = context;
	}
	/**
	* @param {Record<string, unknown>} props
	* @param {any} runes
	* @param {Function} [fn]
	* @returns {void}
	*/
	function push(props, runes = false, fn) {
		component_context = {
			p: component_context,
			i: false,
			c: null,
			e: null,
			s: props,
			x: null,
			r: active_effect,
			l: legacy_mode_flag && !runes ? {
				s: null,
				u: null,
				$: []
			} : null
		};
	}
	/**
	* @template {Record<string, any>} T
	* @param {T} [component]
	* @returns {T}
	*/
	function pop(component) {
		var context = component_context;
		var effects = context.e;
		if (effects !== null) {
			context.e = null;
			for (var fn of effects) create_user_effect(fn);
		}
		if (component !== void 0) context.x = component;
		context.i = true;
		component_context = context.p;
		return component ?? {};
	}
	/** @returns {boolean} */
	function is_runes() {
		return !legacy_mode_flag || component_context !== null && component_context.l === null;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/task.js
	/** @type {Array<() => void>} */
	var micro_tasks = [];
	function run_micro_tasks() {
		var tasks = micro_tasks;
		micro_tasks = [];
		run_all(tasks);
	}
	/**
	* @param {() => void} fn
	*/
	function queue_micro_task(fn) {
		if (micro_tasks.length === 0 && !is_flushing_sync) {
			var tasks = micro_tasks;
			queueMicrotask(() => {
				if (tasks === micro_tasks) run_micro_tasks();
			});
		}
		micro_tasks.push(fn);
	}
	/**
	* @param {unknown} error
	*/
	function handle_error(error) {
		var effect = active_effect;
		if (effect === null) {
			/** @type {Derived} */ active_reaction.f |= ERROR_VALUE;
			return error;
		}
		if ((effect.f & 32768) === 0 && (effect.f & 4) === 0) throw error;
		invoke_error_boundary(error, effect);
	}
	/**
	* @param {unknown} error
	* @param {Effect | null} effect
	*/
	function invoke_error_boundary(error, effect) {
		if (effect !== null && (effect.f & 16384) !== 0) return;
		while (effect !== null) {
			if ((effect.f & 128) !== 0) {
				if ((effect.f & 32768) === 0) throw error;
				try {
					/** @type {Boundary} */ effect.b.error(error);
					return;
				} catch (e) {
					error = e;
				}
			}
			effect = effect.parent;
		}
		throw error;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/status.js
	/** @import { Derived, Signal } from '#client' */
	var STATUS_MASK = ~(DIRTY | MAYBE_DIRTY | CLEAN);
	/**
	* @param {Signal} signal
	* @param {number} status
	*/
	function set_signal_status(signal, status) {
		signal.f = signal.f & STATUS_MASK | status;
	}
	/**
	* Set a derived's status to CLEAN or MAYBE_DIRTY based on its connection state.
	* @param {Derived} derived
	*/
	function update_derived_status(derived) {
		if ((derived.f & 512) !== 0 || derived.deps === null) set_signal_status(derived, CLEAN);
		else set_signal_status(derived, MAYBE_DIRTY);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/utils.js
	/** @import { Derived, Effect, Value } from '#client' */
	/**
	* @param {Value[] | null} deps
	*/
	function clear_marked(deps) {
		if (deps === null) return;
		for (const dep of deps) {
			if ((dep.f & 2) === 0 || (dep.f & 65536) === 0) continue;
			dep.f ^= WAS_MARKED;
			clear_marked(
				/** @type {Derived} */
				dep.deps
			);
		}
	}
	/**
	* @param {Effect} effect
	* @param {Set<Effect>} dirty_effects
	* @param {Set<Effect>} maybe_dirty_effects
	*/
	function defer_effect(effect, dirty_effects, maybe_dirty_effects) {
		if ((effect.f & 2048) !== 0) dirty_effects.add(effect);
		else if ((effect.f & 4096) !== 0) maybe_dirty_effects.add(effect);
		clear_marked(effect.deps);
		set_signal_status(effect, CLEAN);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/store.js
	/**
	* We set this to `true` when updating a store so that we correctly
	* schedule effects if the update takes place inside a `$:` effect
	*/
	var legacy_is_updating_store = false;
	/**
	* Whether or not the prop currently being read is a store binding, as in
	* `<Child bind:x={$y} />`. If it is, we treat the prop as mutable even in
	* runes mode, and skip `binding_property_non_reactive` validation
	*/
	var is_store_binding = false;
	/**
	* Returns a tuple that indicates whether `fn()` reads a prop that is a store binding.
	* Used to prevent `binding_property_non_reactive` validation false positives and
	* ensure that these props are treated as mutable even in runes mode
	* @template T
	* @param {() => T} fn
	* @returns {[T, boolean]}
	*/
	function capture_store_binding(fn) {
		var previous_is_store_binding = is_store_binding;
		try {
			is_store_binding = false;
			return [fn(), is_store_binding];
		} finally {
			is_store_binding = previous_is_store_binding;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
	/**
	* @template T
	* @param {() => T} fn
	*/
	function without_reactive_context(fn) {
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(null);
		set_active_effect(null);
		try {
			return fn();
		} finally {
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}
	//#endregion
	//#region node_modules/svelte/src/reactivity/create-subscriber.js
	/**
	* Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity.
	* It's particularly useful for integrating with web APIs like `MediaQuery`, `IntersectionObserver`, or `WebSocket`.
	*
	* If `subscribe` is called inside an effect (including indirectly, for example inside a getter),
	* the `start` callback will be called with an `update` function. Whenever `update` is called, the effect re-runs.
	*
	* If `start` returns a cleanup function, it will be called when the effect is destroyed.
	*
	* If `subscribe` is called in multiple effects, `start` will only be called once as long as the effects
	* are active, and the returned teardown function will only be called when all effects are destroyed.
	*
	* It's best understood with an example. Here's an implementation of [`MediaQuery`](https://svelte.dev/docs/svelte/svelte-reactivity#MediaQuery):
	*
	* ```js
	* import { createSubscriber } from 'svelte/reactivity';
	* import { on } from 'svelte/events';
	*
	* export class MediaQuery {
	* 	#query;
	* 	#subscribe;
	*
	* 	constructor(query) {
	* 		this.#query = window.matchMedia(`(${query})`);
	*
	* 		this.#subscribe = createSubscriber((update) => {
	* 			// when the `change` event occurs, re-run any effects that read `this.current`
	* 			const off = on(this.#query, 'change', update);
	*
	* 			// stop listening when all the effects are destroyed
	* 			return () => off();
	* 		});
	* 	}
	*
	* 	get current() {
	* 		// This makes the getter reactive, if read in an effect
	* 		this.#subscribe();
	*
	* 		// Return the current state of the query, whether or not we're in an effect
	* 		return this.#query.matches;
	* 	}
	* }
	* ```
	* @param {(update: () => void) => (() => void) | void} start
	* @since 5.7.0
	*/
	function createSubscriber(start) {
		let subscribers = 0;
		let version = source(0);
		/** @type {(() => void) | void} */
		let stop;
		return () => {
			if (effect_tracking()) {
				get(version);
				render_effect(() => {
					if (subscribers === 0) stop = untrack(() => start(() => increment(version)));
					subscribers += 1;
					return () => {
						queue_micro_task(() => {
							subscribers -= 1;
							if (subscribers === 0) {
								stop?.();
								stop = void 0;
								increment(version);
							}
						});
					};
				});
			}
		};
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
	/** @import { Effect, Source, TemplateNode, } from '#client' */
	/**
	* @typedef {{
	* 	 onerror?: ((error: unknown, reset: () => void) => void) | null;
	*   failed?: ((anchor: Node, error: () => unknown, reset: () => () => void) => void) | null;
	*   pending?: ((anchor: Node) => void) | null;
	* }} BoundaryProps
	*/
	var flags = EFFECT_TRANSPARENT | EFFECT_PRESERVED;
	/**
	* @param {TemplateNode} node
	* @param {BoundaryProps} props
	* @param {((anchor: Node) => void)} children
	* @param {((error: unknown) => unknown) | undefined} [transform_error]
	* @returns {void}
	*/
	function boundary(node, props, children, transform_error) {
		new Boundary(node, props, children, transform_error);
	}
	var Boundary = class {
		/** @type {Boundary | null} */
		parent;
		is_pending = false;
		/**
		* API-level transformError transform function. Transforms errors before they reach the `failed` snippet.
		* Inherited from parent boundary, or defaults to identity.
		* @type {(error: unknown) => unknown}
		*/
		transform_error;
		/** @type {TemplateNode} */
		#anchor;
		/** @type {TemplateNode | null} */
		#hydrate_open = hydrating ? hydrate_node : null;
		/** @type {BoundaryProps} */
		#props;
		/** @type {((anchor: Node) => void)} */
		#children;
		/** @type {Effect} */
		#effect;
		/** @type {Effect | null} */
		#main_effect = null;
		/** @type {Effect | null} */
		#pending_effect = null;
		/** @type {Effect | null} */
		#failed_effect = null;
		/** @type {DocumentFragment | null} */
		#offscreen_fragment = null;
		#local_pending_count = 0;
		#pending_count = 0;
		#pending_count_update_queued = false;
		/** @type {Set<Effect>} */
		#dirty_effects = /* @__PURE__ */ new Set();
		/** @type {Set<Effect>} */
		#maybe_dirty_effects = /* @__PURE__ */ new Set();
		/**
		* A source containing the number of pending async deriveds/expressions.
		* Only created if `$effect.pending()` is used inside the boundary,
		* otherwise updating the source results in needless `Batch.ensure()`
		* calls followed by no-op flushes
		* @type {Source<number> | null}
		*/
		#effect_pending = null;
		#effect_pending_subscriber = createSubscriber(() => {
			this.#effect_pending = source(this.#local_pending_count);
			return () => {
				this.#effect_pending = null;
			};
		});
		/**
		* @param {TemplateNode} node
		* @param {BoundaryProps} props
		* @param {((anchor: Node) => void)} children
		* @param {((error: unknown) => unknown) | undefined} [transform_error]
		*/
		constructor(node, props, children, transform_error) {
			this.#anchor = node;
			this.#props = props;
			this.#children = (anchor) => {
				var effect = active_effect;
				effect.b = this;
				effect.f |= 128;
				children(anchor);
			};
			this.parent = active_effect.b;
			this.transform_error = transform_error ?? this.parent?.transform_error ?? ((e) => e);
			this.#effect = block(() => {
				if (hydrating) {
					const comment = this.#hydrate_open;
					hydrate_next();
					const server_rendered_pending = comment.data === "[!";
					if (comment.data.startsWith("[?")) {
						const serialized_error = JSON.parse(comment.data.slice(2));
						this.#hydrate_failed_content(serialized_error);
					} else if (server_rendered_pending) this.#hydrate_pending_content();
					else this.#hydrate_resolved_content();
				} else this.#render();
			}, flags);
			if (hydrating) this.#anchor = hydrate_node;
		}
		#hydrate_resolved_content() {
			try {
				this.#main_effect = branch(() => this.#children(this.#anchor));
			} catch (error) {
				this.error(error);
			}
		}
		/**
		* @param {unknown} error The deserialized error from the server's hydration comment
		*/
		#hydrate_failed_content(error) {
			const failed = this.#props.failed;
			const { reset, invoke_onerror } = this.#create_reset(error);
			queue_micro_task(invoke_onerror);
			if (!failed) return;
			this.#failed_effect = branch(() => {
				failed(this.#anchor, () => error, () => reset);
			});
		}
		/**
		* Creates the `reset` function for a failed boundary, along with a function
		* that invokes `onerror` with it (if provided)
		* @param {unknown} error
		* @returns {{ reset: () => void, invoke_onerror: () => void }}
		*/
		#create_reset(error) {
			var did_reset = false;
			var calling_on_error = false;
			const reset = () => {
				if (did_reset) {
					svelte_boundary_reset_noop();
					return;
				}
				did_reset = true;
				if (calling_on_error) svelte_boundary_reset_onerror();
				if (this.#failed_effect !== null) pause_effect(this.#failed_effect, () => {
					this.#failed_effect = null;
				});
				this.#run(() => {
					this.#render();
				});
			};
			const invoke_onerror = () => {
				try {
					calling_on_error = true;
					this.#props.onerror?.(error, reset);
					calling_on_error = false;
				} catch (err) {
					invoke_error_boundary(err, this.#effect && this.#effect.parent);
				}
			};
			return {
				reset,
				invoke_onerror
			};
		}
		#hydrate_pending_content() {
			const pending = this.#props.pending;
			if (!pending) return;
			this.is_pending = true;
			this.#pending_effect = branch(() => pending(this.#anchor));
			queue_micro_task(() => {
				var fragment = this.#offscreen_fragment = document.createDocumentFragment();
				var anchor = create_text();
				fragment.append(anchor);
				this.#main_effect = this.#run(() => {
					return branch(() => this.#children(anchor));
				});
				if (this.#pending_count === 0) {
					this.#anchor.before(fragment);
					this.#offscreen_fragment = null;
					pause_effect(this.#pending_effect, () => {
						this.#pending_effect = null;
					});
					this.#resolve(current_batch);
				}
			});
		}
		#render() {
			try {
				this.is_pending = this.has_pending_snippet();
				this.#pending_count = 0;
				this.#local_pending_count = 0;
				this.#main_effect = branch(() => {
					this.#children(this.#anchor);
				});
				if (this.#pending_count > 0) {
					var fragment = this.#offscreen_fragment = document.createDocumentFragment();
					move_effect(this.#main_effect, fragment);
					const pending = this.#props.pending;
					this.#pending_effect = branch(() => pending(this.#anchor));
				} else this.#resolve(current_batch);
			} catch (error) {
				this.error(error);
			}
		}
		/**
		* @param {Batch} batch
		*/
		#resolve(batch) {
			this.is_pending = false;
			batch.transfer_effects(this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Defer an effect inside a pending boundary until the boundary resolves
		* @param {Effect} effect
		*/
		defer_effect(effect) {
			defer_effect(effect, this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Returns `false` if the effect exists inside a boundary whose pending snippet is shown
		* @returns {boolean}
		*/
		is_rendered() {
			return !this.is_pending && (!this.parent || this.parent.is_rendered());
		}
		has_pending_snippet() {
			return !!this.#props.pending;
		}
		/**
		* @template T
		* @param {() => T} fn
		*/
		#run(fn) {
			var previous_effect = active_effect;
			var previous_reaction = active_reaction;
			var previous_ctx = component_context;
			set_active_effect(this.#effect);
			set_active_reaction(this.#effect);
			set_component_context(this.#effect.ctx);
			try {
				Batch.ensure();
				return fn();
			} catch (e) {
				handle_error(e);
				return null;
			} finally {
				set_active_effect(previous_effect);
				set_active_reaction(previous_reaction);
				set_component_context(previous_ctx);
			}
		}
		/**
		* Updates the pending count associated with the currently visible pending snippet,
		* if any, such that we can replace the snippet with content once work is done
		* @param {1 | -1} d
		* @param {Batch} batch
		*/
		#update_pending_count(d, batch) {
			if (!this.has_pending_snippet()) {
				if (this.parent) this.parent.#update_pending_count(d, batch);
				return;
			}
			this.#pending_count += d;
			if (this.#pending_count === 0) {
				this.#resolve(batch);
				if (this.#pending_effect) pause_effect(this.#pending_effect, () => {
					this.#pending_effect = null;
				});
				if (this.#offscreen_fragment) {
					this.#anchor.before(this.#offscreen_fragment);
					this.#offscreen_fragment = null;
				}
			}
		}
		/**
		* Update the source that powers `$effect.pending()` inside this boundary,
		* and controls when the current `pending` snippet (if any) is removed.
		* Do not call from inside the class
		* @param {1 | -1} d
		* @param {Batch} batch
		*/
		update_pending_count(d, batch) {
			this.#update_pending_count(d, batch);
			this.#local_pending_count += d;
			if (!this.#effect_pending || this.#pending_count_update_queued) return;
			this.#pending_count_update_queued = true;
			queue_micro_task(() => {
				this.#pending_count_update_queued = false;
				if (this.#effect_pending) internal_set(this.#effect_pending, this.#local_pending_count);
			});
		}
		get_effect_pending() {
			this.#effect_pending_subscriber();
			return get(this.#effect_pending);
		}
		/** @param {unknown} error */
		error(error) {
			if (!this.#props.onerror && !this.#props.failed) throw error;
			if (current_batch?.is_fork) {
				if (this.#main_effect) current_batch.skip_effect(this.#main_effect);
				if (this.#pending_effect) current_batch.skip_effect(this.#pending_effect);
				if (this.#failed_effect) current_batch.skip_effect(this.#failed_effect);
				current_batch.oncommit(() => {
					this.#handle_error(error);
				});
			} else this.#handle_error(error);
		}
		/**
		* @param {unknown} error
		*/
		#handle_error(error) {
			if (this.#main_effect) {
				destroy_effect(this.#main_effect);
				this.#main_effect = null;
			}
			if (this.#pending_effect) {
				destroy_effect(this.#pending_effect);
				this.#pending_effect = null;
			}
			if (this.#failed_effect) {
				destroy_effect(this.#failed_effect);
				this.#failed_effect = null;
			}
			if (hydrating) {
				set_hydrate_node(this.#hydrate_open);
				next();
				set_hydrate_node(skip_nodes());
			}
			let failed = this.#props.failed;
			/** @param {unknown} transformed_error */
			const handle_error_result = (transformed_error) => {
				const { reset, invoke_onerror } = this.#create_reset(transformed_error);
				invoke_onerror();
				if (failed) this.#failed_effect = this.#run(() => {
					try {
						return branch(() => {
							var effect = active_effect;
							effect.b = this;
							effect.f |= 128;
							failed(this.#anchor, () => transformed_error, () => reset);
						});
					} catch (error) {
						invoke_error_boundary(error, this.#effect.parent);
						return null;
					}
				});
			};
			queue_micro_task(() => {
				/** @type {unknown} */
				var result;
				try {
					result = this.transform_error(error);
				} catch (e) {
					invoke_error_boundary(e, this.#effect && this.#effect.parent);
					return;
				}
				if (result !== null && typeof result === "object" && typeof result.then === "function")
 /** @type {any} */ result.then(
					handle_error_result,
					/** @param {unknown} e */
					(e) => invoke_error_boundary(e, this.#effect && this.#effect.parent)
				);
				else handle_error_result(result);
			});
		}
	};
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/async.js
	/** @import { Blocker, Effect, Source, Value } from '#client' */
	/**
	* @param {Blocker[]} blockers
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {(values: Value[]) => any} fn
	*/
	function flatten(blockers, sync, async, fn) {
		const d = is_runes() ? derived : derived_safe_equal;
		var pending = blockers.filter((b) => !b.settled);
		var deriveds = sync.map(d);
		if (async.length === 0 && pending.length === 0) {
			fn(deriveds);
			return;
		}
		var parent = active_effect;
		var restore = capture();
		var blocker_promise = pending.length === 1 ? pending[0].promise : pending.length > 1 ? Promise.all(pending.map((b) => b.promise)) : null;
		/**
		* @param {Source[]} async
		*/
		function finish(async) {
			if ((parent.f & 16384) !== 0) return;
			restore();
			try {
				fn([...deriveds, ...async]);
			} catch (error) {
				invoke_error_boundary(error, parent);
			}
			unset_context();
		}
		var decrement_pending = increment_pending();
		if (async.length === 0) {
			/** @type {Promise<any>} */ blocker_promise.then(() => finish([])).finally(decrement_pending);
			return;
		}
		function run() {
			Promise.all(async.map((expression) => /* @__PURE__ */ async_derived(expression))).then(finish).catch((error) => invoke_error_boundary(error, parent)).finally(decrement_pending);
		}
		if (blocker_promise) blocker_promise.then(() => {
			restore();
			run();
			unset_context();
		});
		else run();
	}
	/**
	* Captures the current effect context so that we can restore it after
	* some asynchronous work has happened (so that e.g. `await a + b`
	* causes `b` to be registered as a dependency).
	*/
	function capture() {
		var previous_effect = active_effect;
		var previous_reaction = active_reaction;
		var previous_component_context = component_context;
		var previous_batch = current_batch;
		return function restore(activate_batch = true) {
			set_active_effect(previous_effect);
			set_active_reaction(previous_reaction);
			set_component_context(previous_component_context);
			if (activate_batch && (previous_effect.f & 16384) === 0) {
				previous_batch?.activate();
				previous_batch?.apply();
			}
		};
	}
	function unset_context(deactivate_batch = true) {
		set_active_effect(null);
		set_active_reaction(null);
		set_component_context(null);
		if (deactivate_batch) current_batch?.deactivate();
	}
	/**
	* @returns {(skip?: boolean) => void}
	*/
	function increment_pending() {
		var effect = active_effect;
		var boundary = effect.b;
		var batch = current_batch;
		var blocking = !!boundary?.is_rendered();
		boundary?.update_pending_count(1, batch);
		batch.increment(blocking, effect);
		return () => {
			boundary?.update_pending_count(-1, batch);
			batch.decrement(blocking, effect);
		};
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function derived(fn) {
		var flags = 2 | DIRTY;
		if (active_effect !== null) active_effect.f |= EFFECT_PRESERVED;
		return {
			ctx: component_context,
			deps: null,
			effects: null,
			equals,
			f: flags,
			fn,
			reactions: null,
			rv: 0,
			v: UNINITIALIZED,
			wv: 0,
			parent: active_effect,
			ac: null
		};
	}
	var OBSOLETE = Symbol("obsolete");
	/**
	* @template V
	* @param {() => V | Promise<V>} fn
	* @param {string} [label]
	* @param {string} [location] If provided, print a warning if the value is not read immediately after update
	* @returns {Promise<Source<V>>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function async_derived(fn, label, location) {
		let parent = active_effect;
		if (parent === null) async_derived_orphan();
		var promise = void 0;
		var signal = source(UNINITIALIZED);
		var should_suspend = !active_reaction;
		/** @type {Set<ReturnType<typeof deferred<V>>>} */
		var deferreds = /* @__PURE__ */ new Set();
		async_effect(() => {
			var effect = active_effect;
			/** @type {ReturnType<typeof deferred<V>>} */
			var d = deferred();
			promise = d.promise;
			try {
				Promise.resolve(fn()).then(d.resolve, (e) => {
					if (e !== STALE_REACTION) d.reject(e);
				}).finally(unset_context);
			} catch (error) {
				d.reject(error);
				unset_context();
			}
			var batch = current_batch;
			if (should_suspend) {
				if ((effect.f & 32768) !== 0) var decrement_pending = increment_pending();
				if (parent.b?.is_rendered()) batch.async_deriveds.get(effect)?.reject(OBSOLETE);
				else for (const d of deferreds.values()) d.reject(OBSOLETE);
				deferreds.add(d);
				batch.async_deriveds.set(effect, d);
			}
			/**
			* @param {any} value
			* @param {unknown} error
			*/
			const handler = (value, error = void 0) => {
				decrement_pending?.();
				deferreds.delete(d);
				if (error === OBSOLETE) return;
				batch.activate();
				if (error) {
					signal.f |= ERROR_VALUE;
					internal_set(signal, error);
				} else {
					if ((signal.f & 8388608) !== 0) signal.f ^= ERROR_VALUE;
					internal_set(signal, value);
				}
				batch.deactivate();
			};
			d.promise.then(handler, (e) => handler(null, e || "unknown"));
		});
		teardown(() => {
			for (const d of deferreds) d.reject(OBSOLETE);
		});
		return new Promise((fulfil) => {
			/** @param {Promise<V>} p */
			function next(p) {
				function go() {
					if (p === promise) fulfil(signal);
					else next(promise);
				}
				p.then(go, go);
			}
			next(promise);
		});
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function user_derived(fn) {
		const d = /* @__PURE__ */ derived(fn);
		if (!async_mode_flag) push_reaction_value(d);
		return d;
	}
	/**
	* @template V
	* @param {() => V} fn
	* @returns {Derived<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function derived_safe_equal(fn) {
		const signal = /* @__PURE__ */ derived(fn);
		signal.equals = safe_equals;
		return signal;
	}
	/**
	* @param {Derived} derived
	* @returns {void}
	*/
	function destroy_derived_effects(derived) {
		var effects = derived.effects;
		if (effects !== null) {
			derived.effects = null;
			for (var i = 0; i < effects.length; i += 1) destroy_effect(effects[i]);
		}
	}
	/**
	* @template T
	* @param {Derived} derived
	* @returns {T}
	*/
	function execute_derived(derived) {
		var value;
		var prev_active_effect = active_effect;
		var parent = derived.parent;
		if (!is_destroying_effect && parent !== null && derived.v !== UNINITIALIZED && (parent.f & 24576) !== 0) {
			derived_inert();
			return derived.v;
		}
		set_active_effect(parent);
		try {
			derived.f &= ~WAS_MARKED;
			destroy_derived_effects(derived);
			value = update_reaction(derived);
		} finally {
			set_active_effect(prev_active_effect);
		}
		return value;
	}
	/**
	* @param {Derived} derived
	* @returns {void}
	*/
	function update_derived(derived) {
		var value = execute_derived(derived);
		if (!derived.equals(value)) {
			derived.wv = increment_write_version();
			if (!current_batch?.is_fork || derived.deps === null) {
				if (current_batch !== null) {
					current_batch.capture(derived, value, true);
					previous_batch?.capture(derived, value, true);
				} else derived.v = value;
				if (derived.deps === null) {
					set_signal_status(derived, CLEAN);
					return;
				}
			}
		}
		if (is_destroying_effect) return;
		if (batch_values !== null) {
			if (effect_tracking() || current_batch?.is_fork) batch_values.set(derived, value);
		} else update_derived_status(derived);
	}
	/**
	* @param {Derived} derived
	*/
	function freeze_derived_effects(derived) {
		if (derived.effects === null) return;
		for (const e of derived.effects) if (e.teardown || e.ac) {
			e.teardown?.();
			if (e.ac !== null) without_reactive_context(() => {
				/** @type {AbortController} */ e.ac.abort(STALE_REACTION);
				e.ac = null;
			});
			if (e.fn !== null) e.teardown = noop;
			remove_reactions(e, 0);
			destroy_effect_children(e);
		}
	}
	/**
	* @param {Derived} derived
	*/
	function unfreeze_derived_effects(derived) {
		if (derived.effects === null) return;
		for (const e of derived.effects) if (e.teardown && e.fn !== null) update_effect(e);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/batch.js
	/** @import { Fork } from 'svelte' */
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	/** @type {Batch | null} */
	var first_batch = null;
	/** @type {Batch | null} */
	var last_batch = null;
	/** @type {Batch | null} */
	var current_batch = null;
	/**
	* This is needed to avoid overwriting inputs
	* @type {Batch | null}
	*/
	var previous_batch = null;
	/**
	* When time travelling (i.e. working in one batch, while other batches
	* still have ongoing work), we ignore the real values of affected
	* signals in favour of their values within the batch
	* @type {Map<Value, any> | null}
	*/
	var batch_values = null;
	/** @type {Effect | null} */
	var last_scheduled_effect = null;
	var is_flushing_sync = false;
	var is_processing = false;
	/**
	* During traversal, this is an array. Newly created effects are (if not immediately
	* executed) pushed to this array, rather than going through the scheduling
	* rigamarole that would cause another turn of the flush loop.
	* @type {Effect[] | null}
	*/
	var collected_effects = null;
	/**
	* An array of effects that are marked during traversal as a result of a `set`
	* (not `internal_set`) call. These will be added to the next batch and
	* trigger another `batch.process()`
	* @type {Effect[] | null}
	* @deprecated when we get rid of legacy mode and stores, we can get rid of this
	*/
	var legacy_updates = null;
	var flush_count = 0;
	var uid = 1;
	var Batch = class Batch {
		id = uid++;
		/** True as soon as `#process` was called */
		#started = false;
		linked = true;
		/** @type {Batch | null} */
		#prev = null;
		/** @type {Batch | null} */
		#next = null;
		/** @type {Map<Effect, ReturnType<typeof deferred<any>>>} */
		async_deriveds = /* @__PURE__ */ new Map();
		/**
		* The current values of any signals that are updated in this batch.
		* Tuple format: [value, is_derived] (note: is_derived is false for deriveds, too, if they were overridden via assignment)
		* They keys of this map are identical to `this.#previous`
		* @type {Map<Value, [any, boolean]>}
		*/
		current = /* @__PURE__ */ new Map();
		/**
		* The values of any signals (sources and deriveds) that are updated in this batch _before_ those updates took place.
		* They keys of this map are identical to `this.#current`
		* @type {Map<Value, any>}
		*/
		previous = /* @__PURE__ */ new Map();
		/**
		* When the batch is committed (and the DOM is updated), we need to remove old branches
		* and append new ones by calling the functions added inside (if/each/key/etc) blocks
		* @type {Set<(batch: Batch) => void>}
		*/
		#commit_callbacks = /* @__PURE__ */ new Set();
		/**
		* If a fork is discarded, we need to destroy any effects that are no longer needed
		* @type {Set<(batch: Batch) => void>}
		*/
		#discard_callbacks = /* @__PURE__ */ new Set();
		/**
		* The number of async effects that are currently in flight
		*/
		#pending = 0;
		/**
		* Async effects that are currently in flight, _not_ inside a pending boundary
		* @type {Map<Effect, number>}
		*/
		#blocking_pending = /* @__PURE__ */ new Map();
		/**
		* A deferred that resolves when the batch is committed, used with `settled()`
		* TODO replace with Promise.withResolvers once supported widely enough
		* @type {{ promise: Promise<void>, resolve: (value?: any) => void, reject: (reason: unknown) => void } | null}
		*/
		#deferred = null;
		/**
		* The root effects that need to be flushed
		* @type {Effect[]}
		*/
		#roots = [];
		/**
		* Effects created while this batch was active.
		* @type {Effect[]}
		*/
		#new_effects = [];
		/**
		* Deferred effects (which run after async work has completed) that are DIRTY
		* @type {Set<Effect>}
		*/
		#dirty_effects = /* @__PURE__ */ new Set();
		/**
		* Deferred effects that are MAYBE_DIRTY
		* @type {Set<Effect>}
		*/
		#maybe_dirty_effects = /* @__PURE__ */ new Set();
		/**
		* A map of branches that still exist, but will be destroyed when this batch
		* is committed — we skip over these during `process`.
		* The value contains child effects that were dirty/maybe_dirty before being reset,
		* so they can be rescheduled if the branch survives.
		* @type {Map<Effect, { d: Effect[], m: Effect[] }>}
		*/
		#skipped_branches = /* @__PURE__ */ new Map();
		/**
		* Inverse of #skipped_branches which we need to tell prior batches to unskip them when committing
		* @type {Set<Effect>}
		*/
		#unskipped_branches = /* @__PURE__ */ new Set();
		is_fork = false;
		#decrement_queued = false;
		constructor() {
			if (last_batch === null) first_batch = last_batch = this;
			else {
				last_batch.#next = this;
				this.#prev = last_batch;
			}
			last_batch = this;
		}
		#is_deferred() {
			if (this.is_fork) return true;
			for (const effect of this.#blocking_pending.keys()) {
				var e = effect;
				var skipped = false;
				while (e.parent !== null) {
					if (this.#skipped_branches.has(e)) {
						skipped = true;
						break;
					}
					e = e.parent;
				}
				if (!skipped) return true;
			}
			return false;
		}
		/**
		* Add an effect to the #skipped_branches map and reset its children
		* @param {Effect} effect
		*/
		skip_effect(effect) {
			if (!this.#skipped_branches.has(effect)) this.#skipped_branches.set(effect, {
				d: [],
				m: []
			});
			this.#unskipped_branches.delete(effect);
		}
		/**
		* Remove an effect from the #skipped_branches map and reschedule
		* any tracked dirty/maybe_dirty child effects
		* @param {Effect} effect
		* @param {(e: Effect) => void} callback
		*/
		unskip_effect(effect, callback = (e) => this.schedule(e)) {
			var tracked = this.#skipped_branches.get(effect);
			if (tracked) {
				this.#skipped_branches.delete(effect);
				for (var e of tracked.d) {
					set_signal_status(e, DIRTY);
					callback(e);
				}
				for (e of tracked.m) {
					set_signal_status(e, MAYBE_DIRTY);
					callback(e);
				}
			}
			this.#unskipped_branches.add(effect);
		}
		#process() {
			this.#started = true;
			if (flush_count++ > 1e3) {
				this.#unlink();
				infinite_loop_guard();
			}
			for (const e of this.#dirty_effects) {
				this.#maybe_dirty_effects.delete(e);
				set_signal_status(e, DIRTY);
				this.schedule(e);
			}
			for (const e of this.#maybe_dirty_effects) {
				set_signal_status(e, MAYBE_DIRTY);
				this.schedule(e);
			}
			const roots = this.#roots;
			this.#roots = [];
			this.apply();
			/** @type {Effect[]} */
			var effects = collected_effects = [];
			/** @type {Effect[]} */
			var render_effects = [];
			/**
			* @type {Effect[]}
			* @deprecated when we get rid of legacy mode and stores, we can get rid of this
			*/
			var updates = legacy_updates = [];
			for (const root of roots) try {
				this.#traverse(root, effects, render_effects);
			} catch (e) {
				reset_all(root);
				if (!this.#is_deferred()) this.discard();
				throw e;
			}
			current_batch = null;
			if (updates.length > 0) {
				var batch = Batch.ensure();
				for (const e of updates) batch.schedule(e);
			}
			collected_effects = null;
			legacy_updates = null;
			if (this.#is_deferred()) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);
				for (const [e, t] of this.#skipped_branches) reset_branch(e, t);
				if (updates.length > 0)
 /** @type {Batch} */ current_batch.#process();
				return;
			}
			const earlier_batch = this.#find_earlier_batch();
			if (earlier_batch) {
				this.#defer_effects(render_effects);
				this.#defer_effects(effects);
				earlier_batch.#merge(this);
				return;
			}
			this.#dirty_effects.clear();
			this.#maybe_dirty_effects.clear();
			for (const fn of this.#commit_callbacks) fn(this);
			this.#commit_callbacks.clear();
			previous_batch = this;
			flush_queued_effects(render_effects);
			flush_queued_effects(effects);
			previous_batch = null;
			this.#deferred?.resolve();
			var next_batch = current_batch;
			if (this.#pending === 0 && (this.#roots.length === 0 || next_batch !== null)) {
				this.#unlink();
				if (async_mode_flag) {
					this.#commit();
					current_batch = next_batch;
				}
			}
			if (this.#roots.length > 0) if (next_batch !== null) {
				const batch = next_batch;
				batch.#roots.push(...this.#roots.filter((r) => !batch.#roots.includes(r)));
			} else next_batch = this;
			if (next_batch !== null) next_batch.#process();
		}
		/**
		* Traverse the effect tree, executing effects or stashing
		* them for later execution as appropriate
		* @param {Effect} root
		* @param {Effect[]} effects
		* @param {Effect[]} render_effects
		*/
		#traverse(root, effects, render_effects) {
			root.f ^= CLEAN;
			var effect = root.first;
			while (effect !== null) {
				var flags = effect.f;
				var is_branch = (flags & 96) !== 0;
				if (!(is_branch && (flags & 1024) !== 0 || (flags & 8192) !== 0 || this.#skipped_branches.has(effect)) && effect.fn !== null) {
					if (is_branch) effect.f ^= CLEAN;
					else if ((flags & 4) !== 0) effects.push(effect);
					else if (async_mode_flag && (flags & 16777224) !== 0) render_effects.push(effect);
					else if (is_dirty(effect)) {
						if ((flags & 16) !== 0) this.#maybe_dirty_effects.add(effect);
						update_effect(effect);
					}
					var child = effect.first;
					if (child !== null) {
						effect = child;
						continue;
					}
				}
				while (effect !== null) {
					var next = effect.next;
					if (next !== null) {
						effect = next;
						break;
					}
					effect = effect.parent;
				}
			}
		}
		#find_earlier_batch() {
			var batch = this.#prev;
			while (batch !== null) {
				if (!batch.is_fork) {
					for (const [value, [, is_derived]] of this.current) if (batch.current.has(value) && !is_derived) return batch;
				}
				batch = batch.#prev;
			}
			return null;
		}
		/**
		* @param {Batch} batch
		*/
		#merge(batch) {
			for (const [source, value] of batch.current) {
				if (!this.previous.has(source) && batch.previous.has(source)) this.previous.set(source, batch.previous.get(source));
				this.current.set(source, value);
			}
			for (const [effect, deferred] of batch.async_deriveds) {
				const d = this.async_deriveds.get(effect);
				if (d) deferred.promise.then(d.resolve).catch(d.reject);
			}
			batch.async_deriveds.clear();
			this.transfer_effects(batch.#dirty_effects, batch.#maybe_dirty_effects);
			/**
			* mark all effects that depend on `batch.current`, except the
			* async effects that we just resolved (TODO unless they depend
			* on values in this batch that are NOT in the later batch?).
			* Through this we also will populate the correct #skipped_branches,
			* oncommit callbacks etc, so we don't need to merge them separately.
			* @param {Value} value
			*/
			const mark = (value) => {
				var reactions = value.reactions;
				if (reactions === null) return;
				if ((value.f & 2) !== 0 && (value.f & 6144) === 0) return;
				for (const reaction of reactions) {
					var flags = reaction.f;
					if ((flags & 2) !== 0) mark(reaction);
					else {
						var effect = reaction;
						if (flags & 4194320 && !this.async_deriveds.has(effect)) {
							this.#maybe_dirty_effects.delete(effect);
							set_signal_status(effect, DIRTY);
							this.schedule(effect);
						}
					}
				}
			};
			for (const source of this.current.keys()) mark(source);
			this.oncommit(() => batch.discard());
			batch.#unlink();
			current_batch = this;
			this.#process();
		}
		/**
		* @param {Effect[]} effects
		*/
		#defer_effects(effects) {
			for (var i = 0; i < effects.length; i += 1) defer_effect(effects[i], this.#dirty_effects, this.#maybe_dirty_effects);
		}
		/**
		* Associate a change to a given source with the current
		* batch, noting its previous and current values
		* @param {Value} source
		* @param {any} value
		* @param {boolean} [is_derived]
		*/
		capture(source, value, is_derived = false) {
			if (source.v !== UNINITIALIZED && !this.previous.has(source)) this.previous.set(source, source.v);
			if ((source.f & 8388608) === 0) {
				this.current.set(source, [value, is_derived]);
				batch_values?.set(source, value);
			}
			if (!this.is_fork) source.v = value;
		}
		activate() {
			current_batch = this;
		}
		deactivate() {
			current_batch = null;
			batch_values = null;
		}
		flush() {
			try {
				is_processing = true;
				current_batch = this;
				this.#process();
			} finally {
				flush_count = 0;
				last_scheduled_effect = null;
				collected_effects = null;
				legacy_updates = null;
				is_processing = false;
				current_batch = null;
				batch_values = null;
				old_values.clear();
			}
		}
		discard() {
			for (const fn of this.#discard_callbacks) fn(this);
			this.#discard_callbacks.clear();
			for (const deferred of this.async_deriveds.values()) deferred.reject(OBSOLETE);
			this.#unlink();
			this.#deferred?.resolve();
		}
		/**
		* @param {Effect} effect
		*/
		register_created_effect(effect) {
			this.#new_effects.push(effect);
		}
		#commit() {
			for (let batch = first_batch; batch !== null; batch = batch.#next) {
				var is_earlier = batch.id < this.id;
				/** @type {Source[]} */
				var sources = [];
				for (const [source, [value, is_derived]] of this.current) {
					if (batch.current.has(source)) {
						var batch_value = batch.current.get(source)[0];
						if (is_earlier && value !== batch_value) batch.current.set(source, [value, is_derived]);
						else continue;
					}
					sources.push(source);
				}
				if (is_earlier) for (const [effect, deferred] of this.async_deriveds) {
					const d = batch.async_deriveds.get(effect);
					if (d) deferred.promise.then(d.resolve).catch(d.reject);
				}
				var current = [...batch.current.keys()].filter((source) => !batch.current.get(source)[1]);
				if (!batch.#started || current.length === 0) continue;
				var others = current.filter((source) => !this.current.has(source));
				if (others.length === 0) {
					if (is_earlier) batch.discard();
				} else if (sources.length > 0) {
					if (is_earlier) for (const unskipped of this.#unskipped_branches) batch.unskip_effect(unskipped, (e) => {
						if ((e.f & 4194320) !== 0) batch.schedule(e);
						else batch.#defer_effects([e]);
					});
					batch.activate();
					/** @type {Set<Value>} */
					var marked = /* @__PURE__ */ new Set();
					/** @type {Map<Reaction, boolean>} */
					var checked = /* @__PURE__ */ new Map();
					for (var source of sources) mark_effects(source, others, marked, checked);
					checked = /* @__PURE__ */ new Map();
					var current_unequal = [...batch.current].filter(([c, v1]) => {
						const v2 = this.current.get(c);
						if (!v2) return true;
						return v2[0] !== v1[0] || v2[1] !== v1[1];
					}).map(([c]) => c);
					if (current_unequal.length > 0) {
						for (const effect of this.#new_effects) if ((effect.f & 155648) === 0 && depends_on(effect, current_unequal, checked)) if ((effect.f & 4194320) !== 0) {
							set_signal_status(effect, DIRTY);
							batch.schedule(effect);
						} else batch.#dirty_effects.add(effect);
					}
					if (batch.#roots.length > 0 && !batch.#decrement_queued) {
						batch.apply();
						for (var root of batch.#roots) batch.#traverse(root, [], []);
						batch.#roots = [];
					}
					batch.deactivate();
				}
			}
		}
		/**
		* @param {boolean} blocking
		* @param {Effect} effect
		*/
		increment(blocking, effect) {
			this.#pending += 1;
			if (blocking) {
				let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
				this.#blocking_pending.set(effect, blocking_pending_count + 1);
			}
		}
		/**
		* @param {boolean} blocking
		* @param {Effect} effect
		*/
		decrement(blocking, effect) {
			this.#pending -= 1;
			if (blocking) {
				let blocking_pending_count = this.#blocking_pending.get(effect) ?? 0;
				if (blocking_pending_count === 1) this.#blocking_pending.delete(effect);
				else this.#blocking_pending.set(effect, blocking_pending_count - 1);
			}
			if (this.#decrement_queued) return;
			this.#decrement_queued = true;
			queue_micro_task(() => {
				this.#decrement_queued = false;
				if (this.linked) this.flush();
			});
		}
		/**
		* @param {Set<Effect>} dirty_effects
		* @param {Set<Effect>} maybe_dirty_effects
		*/
		transfer_effects(dirty_effects, maybe_dirty_effects) {
			for (const e of dirty_effects) this.#dirty_effects.add(e);
			for (const e of maybe_dirty_effects) this.#maybe_dirty_effects.add(e);
			dirty_effects.clear();
			maybe_dirty_effects.clear();
		}
		/** @param {(batch: Batch) => void} fn */
		oncommit(fn) {
			this.#commit_callbacks.add(fn);
		}
		/** @param {(batch: Batch) => void} fn */
		ondiscard(fn) {
			this.#discard_callbacks.add(fn);
		}
		settled() {
			return (this.#deferred ??= deferred()).promise;
		}
		static ensure() {
			if (current_batch === null) {
				const batch = current_batch = new Batch();
				if (!is_processing && !is_flushing_sync) queue_micro_task(() => {
					if (!batch.#started) batch.flush();
				});
			}
			return current_batch;
		}
		apply() {
			if (!async_mode_flag || !this.is_fork && this.#prev === null && this.#next === null) {
				batch_values = null;
				return;
			}
			batch_values = /* @__PURE__ */ new Map();
			for (const [source, [value]] of this.current) batch_values.set(source, value);
			for (let batch = first_batch; batch !== null; batch = batch.#next) {
				if (batch === this || batch.is_fork) continue;
				var intersects = false;
				if (batch.id < this.id) for (const [source, [, is_derived]] of batch.current) {
					if (is_derived) continue;
					if (this.current.has(source)) {
						intersects = true;
						break;
					}
				}
				if (!intersects) {
					for (const [source, previous] of batch.previous) if (!batch_values.has(source)) batch_values.set(source, previous);
				}
			}
		}
		/**
		*
		* @param {Effect} effect
		*/
		schedule(effect) {
			last_scheduled_effect = effect;
			if (effect.b?.is_pending && (effect.f & 16777228) !== 0 && (effect.f & 32768) === 0) {
				effect.b.defer_effect(effect);
				return;
			}
			var e = effect;
			while (e.parent !== null) {
				e = e.parent;
				var flags = e.f;
				if (collected_effects !== null && e === active_effect) {
					if (async_mode_flag) return;
					if ((active_reaction === null || (active_reaction.f & 2) === 0) && !legacy_is_updating_store) return;
				}
				if ((flags & 96) !== 0) {
					if ((flags & 1024) === 0) return;
					e.f ^= CLEAN;
				}
			}
			this.#roots.push(e);
		}
		#unlink() {
			if (!this.linked) return;
			var prev = this.#prev;
			var next = this.#next;
			if (prev === null) first_batch = next;
			else prev.#next = next;
			if (next === null) last_batch = prev;
			else next.#prev = prev;
			this.linked = false;
		}
	};
	function infinite_loop_guard() {
		try {
			effect_update_depth_exceeded();
		} catch (error) {
			invoke_error_boundary(error, last_scheduled_effect);
		}
	}
	/** @type {Set<Effect> | null} */
	var eager_block_effects = null;
	/**
	* @param {Array<Effect>} effects
	* @returns {void}
	*/
	function flush_queued_effects(effects) {
		var length = effects.length;
		if (length === 0) return;
		var i = 0;
		while (i < length) {
			var effect = effects[i++];
			if ((effect.f & 24576) === 0 && is_dirty(effect)) {
				eager_block_effects = /* @__PURE__ */ new Set();
				update_effect(effect);
				if (effect.deps === null && effect.first === null && effect.nodes === null && effect.teardown === null && effect.ac === null) unlink_effect(effect);
				if (eager_block_effects?.size > 0) {
					old_values.clear();
					for (const e of eager_block_effects) {
						if ((e.f & 24576) !== 0) continue;
						/** @type {Effect[]} */
						const ordered_effects = [e];
						let ancestor = e.parent;
						while (ancestor !== null) {
							if (eager_block_effects.has(ancestor)) {
								eager_block_effects.delete(ancestor);
								ordered_effects.push(ancestor);
							}
							ancestor = ancestor.parent;
						}
						for (let j = ordered_effects.length - 1; j >= 0; j--) {
							const e = ordered_effects[j];
							if ((e.f & 24576) !== 0) continue;
							update_effect(e);
						}
					}
					eager_block_effects.clear();
				}
			}
		}
		eager_block_effects = null;
	}
	/**
	* This is similar to `mark_reactions`, but it only marks async/block effects
	* depending on `value` and at least one of the other `sources`, so that
	* these effects can re-run after another batch has been committed
	* @param {Value} value
	* @param {Source[]} sources
	* @param {Set<Value>} marked
	* @param {Map<Reaction, boolean>} checked
	*/
	function mark_effects(value, sources, marked, checked) {
		if (marked.has(value)) return;
		marked.add(value);
		if (value.reactions !== null) for (const reaction of value.reactions) {
			const flags = reaction.f;
			if ((flags & 2) !== 0) mark_effects(reaction, sources, marked, checked);
			else if ((flags & 4194320) !== 0 && (flags & 2048) === 0 && depends_on(reaction, sources, checked)) {
				set_signal_status(reaction, DIRTY);
				schedule_effect(reaction);
			}
		}
	}
	/**
	* @param {Reaction} reaction
	* @param {Source[]} sources
	* @param {Map<Reaction, boolean>} checked
	*/
	function depends_on(reaction, sources, checked) {
		const depends = checked.get(reaction);
		if (depends !== void 0) return depends;
		if (reaction.deps !== null) for (const dep of reaction.deps) {
			if (includes.call(sources, dep)) return true;
			if ((dep.f & 2) !== 0 && depends_on(dep, sources, checked)) {
				checked.set(dep, true);
				return true;
			}
		}
		checked.set(reaction, false);
		return false;
	}
	/**
	* @param {Effect} effect
	* @returns {void}
	*/
	function schedule_effect(effect) {
		/** @type {Batch} */ current_batch.schedule(effect);
	}
	/**
	* Mark all the effects inside a skipped branch CLEAN, so that
	* they can be correctly rescheduled later. Tracks dirty and maybe_dirty
	* effects so they can be rescheduled if the branch survives.
	* @param {Effect} effect
	* @param {{ d: Effect[], m: Effect[] }} tracked
	*/
	function reset_branch(effect, tracked) {
		if ((effect.f & 32) !== 0 && (effect.f & 1024) !== 0) return;
		if ((effect.f & 2048) !== 0) tracked.d.push(effect);
		else if ((effect.f & 4096) !== 0) tracked.m.push(effect);
		set_signal_status(effect, CLEAN);
		var e = effect.first;
		while (e !== null) {
			reset_branch(e, tracked);
			e = e.next;
		}
	}
	/**
	* Mark an entire effect tree clean following an error
	* @param {Effect} effect
	*/
	function reset_all(effect) {
		set_signal_status(effect, CLEAN);
		var e = effect.first;
		while (e !== null) {
			reset_all(e);
			e = e.next;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/sources.js
	/** @import { Derived, Effect, Source, Value } from '#client' */
	/** @type {Set<Effect>} */
	var eager_effects = /* @__PURE__ */ new Set();
	/** @type {Map<Source, any>} */
	var old_values = /* @__PURE__ */ new Map();
	var eager_effects_deferred = false;
	/**
	* @template V
	* @param {V} v
	* @param {Error | null} [stack]
	* @returns {Source<V>}
	*/
	function source(v, stack) {
		return {
			f: 0,
			v,
			reactions: null,
			equals,
			rv: 0,
			wv: 0
		};
	}
	/**
	* @template V
	* @param {V} v
	* @param {Error | null} [stack]
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function state(v, stack) {
		const s = source(v, stack);
		push_reaction_value(s);
		return s;
	}
	/**
	* @template V
	* @param {V} initial_value
	* @param {boolean} [immutable]
	* @returns {Source<V>}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function mutable_source(initial_value, immutable = false, trackable = true) {
		const s = source(initial_value);
		if (!immutable) s.equals = safe_equals;
		if (legacy_mode_flag && trackable && component_context !== null && component_context.l !== null) (component_context.l.s ??= []).push(s);
		return s;
	}
	/**
	* @template V
	* @param {Source<V>} source
	* @param {V} value
	* @param {boolean} [should_proxy]
	* @returns {V}
	*/
	function set(source, value, should_proxy = false) {
		if (active_reaction !== null && (!untracking || (active_reaction.f & 131072) !== 0) && is_runes() && (active_reaction.f & 4325394) !== 0 && (current_sources === null || !current_sources.has(source))) state_unsafe_mutation();
		return internal_set(source, should_proxy ? proxy(value) : value, legacy_updates);
	}
	/**
	* @template V
	* @param {Source<V>} source
	* @param {V} value
	* @param {Effect[] | null} [updated_during_traversal]
	* @returns {V}
	*/
	function internal_set(source, value, updated_during_traversal = null) {
		if (!source.equals(value)) {
			old_values.set(source, is_destroying_effect ? value : source.v);
			var batch = Batch.ensure();
			batch.capture(source, value);
			if ((source.f & 2) !== 0) {
				const derived = source;
				if ((source.f & 2048) !== 0) execute_derived(derived);
				if (batch_values === null) update_derived_status(derived);
			}
			source.wv = increment_write_version();
			mark_reactions(source, DIRTY, updated_during_traversal);
			if (is_runes() && active_effect !== null && (active_effect.f & 1024) !== 0 && (active_effect.f & 96) === 0) if (untracked_writes === null) set_untracked_writes([source]);
			else untracked_writes.push(source);
			if (!batch.is_fork && eager_effects.size > 0 && !eager_effects_deferred) flush_eager_effects();
		}
		return value;
	}
	function flush_eager_effects() {
		eager_effects_deferred = false;
		for (const effect of eager_effects) {
			if ((effect.f & 1024) !== 0) set_signal_status(effect, MAYBE_DIRTY);
			let dirty;
			try {
				dirty = is_dirty(effect);
			} catch {
				dirty = true;
			}
			if (dirty) update_effect(effect);
		}
		eager_effects.clear();
	}
	/**
	* Silently (without using `get`) increment a source
	* @param {Source<number>} source
	*/
	function increment(source) {
		set(source, source.v + 1);
	}
	/**
	* @param {Value} signal
	* @param {number} status should be DIRTY or MAYBE_DIRTY
	* @param {Effect[] | null} updated_during_traversal
	* @returns {void}
	*/
	function mark_reactions(signal, status, updated_during_traversal) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		var runes = is_runes();
		var length = reactions.length;
		for (var i = 0; i < length; i++) {
			var reaction = reactions[i];
			var flags = reaction.f;
			if (!runes && reaction === active_effect) continue;
			var not_dirty = (flags & DIRTY) === 0;
			if (not_dirty) set_signal_status(reaction, status);
			if ((flags & 131072) !== 0) eager_effects.add(reaction);
			else if ((flags & 2) !== 0) {
				var derived = reaction;
				batch_values?.delete(derived);
				if ((flags & 65536) === 0) {
					if (flags & 512 && (active_effect === null || (active_effect.f & 2097152) === 0)) reaction.f |= WAS_MARKED;
					mark_reactions(derived, MAYBE_DIRTY, updated_during_traversal);
				}
			} else if (not_dirty) {
				var effect = reaction;
				if ((flags & 16) !== 0 && eager_block_effects !== null) eager_block_effects.add(effect);
				if (updated_during_traversal !== null) updated_during_traversal.push(effect);
				else schedule_effect(effect);
			}
		}
	}
	/**
	* @template T
	* @param {T} value
	* @returns {T}
	*/
	function proxy(value) {
		if (typeof value !== "object" || value === null || STATE_SYMBOL in value) return value;
		const prototype = get_prototype_of(value);
		if (prototype !== object_prototype && prototype !== array_prototype) return value;
		/** @type {Map<any, Source<any>>} */
		var sources = /* @__PURE__ */ new Map();
		var is_proxied_array = is_array(value);
		var version = /* @__PURE__ */ state(0);
		var stack = null;
		var parent_version = update_version;
		/**
		* Executes the proxy in the context of the reaction it was originally created in, if any
		* @template T
		* @param {() => T} fn
		*/
		var with_parent = (fn) => {
			if (update_version === parent_version) return fn();
			var reaction = active_reaction;
			var version = update_version;
			set_active_reaction(null);
			set_update_version(parent_version);
			var result = fn();
			set_active_reaction(reaction);
			set_update_version(version);
			return result;
		};
		if (is_proxied_array) sources.set("length", /* @__PURE__ */ state(
			/** @type {any[]} */
			value.length,
			stack
		));
		return new Proxy(value, {
			defineProperty(_, prop, descriptor) {
				if (!("value" in descriptor) || descriptor.configurable === false || descriptor.enumerable === false || descriptor.writable === false) state_descriptors_fixed();
				var s = sources.get(prop);
				if (s === void 0) with_parent(() => {
					var s = /* @__PURE__ */ state(descriptor.value, stack);
					sources.set(prop, s);
					return s;
				});
				else set(s, descriptor.value, true);
				return true;
			},
			deleteProperty(target, prop) {
				var s = sources.get(prop);
				if (s === void 0) {
					if (prop in target) {
						const s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED, stack));
						sources.set(prop, s);
						increment(version);
					}
				} else {
					set(s, UNINITIALIZED);
					increment(version);
				}
				return true;
			},
			get(target, prop, receiver) {
				if (prop === STATE_SYMBOL) return value;
				var s = sources.get(prop);
				var exists = prop in target;
				if (s === void 0 && (!exists || get_descriptor(target, prop)?.writable)) {
					s = with_parent(() => {
						return /* @__PURE__ */ state(proxy(exists ? target[prop] : UNINITIALIZED), stack);
					});
					sources.set(prop, s);
				}
				if (s !== void 0) {
					var v = get(s);
					return v === UNINITIALIZED ? void 0 : v;
				}
				return Reflect.get(target, prop, receiver);
			},
			getOwnPropertyDescriptor(target, prop) {
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
				if (descriptor && "value" in descriptor) {
					var s = sources.get(prop);
					if (s) descriptor.value = get(s);
				} else if (descriptor === void 0) {
					var source = sources.get(prop);
					var value = source?.v;
					if (source !== void 0 && value !== UNINITIALIZED) return {
						enumerable: true,
						configurable: true,
						value,
						writable: true
					};
				}
				return descriptor;
			},
			has(target, prop) {
				if (prop === STATE_SYMBOL) return true;
				var s = sources.get(prop);
				var has = s !== void 0 && s.v !== UNINITIALIZED || Reflect.has(target, prop);
				if (s !== void 0 || active_effect !== null && (!has || get_descriptor(target, prop)?.writable)) {
					if (s === void 0) {
						s = with_parent(() => {
							return /* @__PURE__ */ state(has ? proxy(target[prop]) : UNINITIALIZED, stack);
						});
						sources.set(prop, s);
					}
					if (get(s) === UNINITIALIZED) return false;
				}
				return has;
			},
			set(target, prop, value, receiver) {
				var s = sources.get(prop);
				var has = prop in target;
				if (is_proxied_array && prop === "length") for (var i = value; i < s.v; i += 1) {
					var other_s = sources.get(i + "");
					if (other_s !== void 0) set(other_s, UNINITIALIZED);
					else if (i in target) {
						other_s = with_parent(() => /* @__PURE__ */ state(UNINITIALIZED, stack));
						sources.set(i + "", other_s);
					}
				}
				if (s === void 0) {
					if (!has || get_descriptor(target, prop)?.writable) {
						s = with_parent(() => /* @__PURE__ */ state(void 0, stack));
						set(s, proxy(value));
						sources.set(prop, s);
					}
				} else {
					has = s.v !== UNINITIALIZED;
					var p = with_parent(() => proxy(value));
					set(s, p);
				}
				var descriptor = Reflect.getOwnPropertyDescriptor(target, prop);
				if (descriptor?.set) descriptor.set.call(receiver, value);
				if (!has) {
					if (is_proxied_array && typeof prop === "string") {
						var ls = sources.get("length");
						var n = Number(prop);
						if (Number.isInteger(n) && n >= ls.v) set(ls, n + 1);
					}
					increment(version);
				}
				return true;
			},
			ownKeys(target) {
				get(version);
				var own_keys = Reflect.ownKeys(target).filter((key) => {
					var source = sources.get(key);
					return source === void 0 || source.v !== UNINITIALIZED;
				});
				for (var [key, source] of sources) if (source.v !== UNINITIALIZED && !(key in target)) own_keys.push(key);
				return own_keys;
			},
			setPrototypeOf() {
				state_prototype_fixed();
			}
		});
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/operations.js
	/** @import { Effect, TemplateNode } from '#client' */
	/** @type {Window} */
	var $window;
	/** @type {boolean} */
	var is_firefox;
	/** @type {() => Node | null} */
	var first_child_getter;
	/** @type {() => Node | null} */
	var next_sibling_getter;
	/**
	* Initialize these lazily to avoid issues when using the runtime in a server context
	* where these globals are not available while avoiding a separate server entry point
	*/
	function init_operations() {
		if ($window !== void 0) return;
		$window = window;
		is_firefox = /Firefox/.test(navigator.userAgent);
		var element_prototype = Element.prototype;
		var node_prototype = Node.prototype;
		var text_prototype = Text.prototype;
		first_child_getter = get_descriptor(node_prototype, "firstChild").get;
		next_sibling_getter = get_descriptor(node_prototype, "nextSibling").get;
		if (is_extensible(element_prototype)) {
			/** @type {any} */ element_prototype[CLASS_CACHE] = void 0;
			/** @type {any} */ element_prototype[ATTRIBUTES_CACHE] = null;
			/** @type {any} */ element_prototype[STYLE_CACHE] = void 0;
			element_prototype.__e = void 0;
		}
		if (is_extensible(text_prototype))
 /** @type {any} */ text_prototype[TEXT_CACHE] = void 0;
	}
	/**
	* @param {string} value
	* @returns {Text}
	*/
	function create_text(value = "") {
		return document.createTextNode(value);
	}
	/**
	* @template {Node} N
	* @param {N} node
	*/
	/*@__NO_SIDE_EFFECTS__*/
	function get_first_child(node) {
		return first_child_getter.call(node);
	}
	/**
	* @template {Node} N
	* @param {N} node
	*/
	/*@__NO_SIDE_EFFECTS__*/
	function get_next_sibling(node) {
		return next_sibling_getter.call(node);
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @template {Node} N
	* @param {N} node
	* @param {boolean} is_text
	* @returns {TemplateNode | null}
	*/
	function child(node, is_text) {
		if (!hydrating) return /* @__PURE__ */ get_first_child(node);
		var child = /* @__PURE__ */ get_first_child(hydrate_node);
		if (child === null) child = hydrate_node.appendChild(create_text());
		else if (is_text && child.nodeType !== 3) {
			var text = create_text();
			child?.before(text);
			set_hydrate_node(text);
			return text;
		}
		if (is_text) merge_text_nodes(child);
		set_hydrate_node(child);
		return child;
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {boolean} [is_text]
	* @returns {TemplateNode | null}
	*/
	function first_child(node, is_text = false) {
		if (!hydrating) {
			var first = /* @__PURE__ */ get_first_child(node);
			if (first instanceof Comment && first.data === "") return /* @__PURE__ */ get_next_sibling(first);
			return first;
		}
		if (is_text) {
			if (hydrate_node?.nodeType !== 3) {
				var text = create_text();
				hydrate_node?.before(text);
				set_hydrate_node(text);
				return text;
			}
			merge_text_nodes(hydrate_node);
		}
		return hydrate_node;
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {TemplateNode} node
	* @param {number} count
	* @param {boolean} is_text
	* @returns {TemplateNode | null}
	*/
	function sibling(node, count = 1, is_text = false) {
		let next_sibling = hydrating ? hydrate_node : node;
		var last_sibling;
		while (count--) {
			last_sibling = next_sibling;
			next_sibling = /* @__PURE__ */ get_next_sibling(next_sibling);
		}
		if (!hydrating) return next_sibling;
		if (is_text) {
			if (next_sibling?.nodeType !== 3) {
				var text = create_text();
				if (next_sibling === null) last_sibling?.after(text);
				else next_sibling.before(text);
				set_hydrate_node(text);
				return text;
			}
			merge_text_nodes(next_sibling);
		}
		set_hydrate_node(next_sibling);
		return next_sibling;
	}
	/**
	* @template {Node} N
	* @param {N} node
	* @returns {void}
	*/
	function clear_text_content(node) {
		node.textContent = "";
	}
	/**
	* Returns `true` if we're updating the current block, for example `condition` in
	* an `{#if condition}` block just changed. In this case, the branch should be
	* appended (or removed) at the same time as other updates within the
	* current `<svelte:boundary>`
	*/
	function should_defer_append() {
		if (!async_mode_flag) return false;
		if (eager_block_effects !== null) return false;
		return (active_effect.f & REACTION_RAN) !== 0;
	}
	/**
	* Branching here is intentional and load-bearing for perf. `createElement(tag)`
	* hits a fast path in Blink that `createElementNS(NAMESPACE_HTML, tag)` doesn't,
	* and passing an explicit `undefined` as the trailing options arg measurably
	* slows both APIs. Funnelling every case through a single `createElementNS(ns,
	* tag, options)` call would be smaller but slower on the HTML path.
	*
	* @template {keyof HTMLElementTagNameMap | string} T
	* @param {T} tag
	* @param {string} [namespace]
	* @param {string} [is]
	* @returns {T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : Element}
	*/
	function create_element(tag, namespace, is) {
		if (namespace == null || namespace === "http://www.w3.org/1999/xhtml") return is ? document.createElement(tag, { is }) : document.createElement(tag);
		return is ? document.createElementNS(namespace, tag, { is }) : document.createElementNS(namespace, tag);
	}
	/**
	* Browsers split text nodes larger than 65536 bytes when parsing.
	* For hydration to succeed, we need to stitch them back together
	* @param {Text} text
	*/
	function merge_text_nodes(text) {
		if (text.nodeValue.length < 65536) return;
		let next = text.nextSibling;
		while (next !== null && next.nodeType === 3) {
			next.remove();
			/** @type {string} */ text.nodeValue += next.nodeValue;
			next = text.nextSibling;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/effects.js
	/** @import { Blocker, ComponentContext, ComponentContextLegacy, Derived, Effect, TemplateNode, TransitionManager } from '#client' */
	/**
	* @param {'$effect' | '$effect.pre' | '$inspect'} rune
	*/
	function validate_effect(rune) {
		if (active_effect === null) {
			if (active_reaction === null) effect_orphan(rune);
			effect_in_unowned_derived();
		}
		if (is_destroying_effect) effect_in_teardown(rune);
	}
	/**
	* @param {Effect} effect
	* @param {Effect} parent_effect
	*/
	function push_effect(effect, parent_effect) {
		var parent_last = parent_effect.last;
		if (parent_last === null) parent_effect.last = parent_effect.first = effect;
		else {
			parent_last.next = effect;
			effect.prev = parent_last;
			parent_effect.last = effect;
		}
	}
	/**
	* @param {number} type
	* @param {null | (() => void | (() => void))} fn
	* @returns {Effect}
	*/
	function create_effect(type, fn) {
		var parent = active_effect;
		if (parent !== null && (parent.f & 8192) !== 0) type |= INERT;
		/** @type {Effect} */
		var effect = {
			ctx: component_context,
			deps: null,
			nodes: null,
			f: type | DIRTY | 512,
			first: null,
			fn,
			last: null,
			next: null,
			parent,
			b: parent && parent.b,
			prev: null,
			teardown: null,
			wv: 0,
			ac: null
		};
		current_batch?.register_created_effect(effect);
		/** @type {Effect | null} */
		var e = effect;
		if ((type & 4) !== 0) if (collected_effects !== null) collected_effects.push(effect);
		else Batch.ensure().schedule(effect);
		else if (fn !== null) {
			try {
				update_effect(effect);
			} catch (e) {
				destroy_effect(effect);
				throw e;
			}
			if (e.deps === null && e.teardown === null && e.nodes === null && e.first === e.last && (e.f & 524288) === 0) {
				e = e.first;
				if ((type & 16) !== 0 && (type & 65536) !== 0 && e !== null) e.f |= EFFECT_TRANSPARENT;
			}
		}
		if (e !== null) {
			e.parent = parent;
			if (parent !== null) push_effect(e, parent);
			if (active_reaction !== null && (active_reaction.f & 2) !== 0 && (type & 64) === 0) {
				var derived = active_reaction;
				(derived.effects ??= []).push(e);
			}
		}
		return effect;
	}
	/**
	* Internal representation of `$effect.tracking()`
	* @returns {boolean}
	*/
	function effect_tracking() {
		return active_reaction !== null && !untracking;
	}
	/**
	* @param {() => void} fn
	*/
	function teardown(fn) {
		const effect = create_effect(8, null);
		set_signal_status(effect, CLEAN);
		effect.teardown = fn;
		return effect;
	}
	/**
	* Internal representation of `$effect(...)`
	* @param {() => void | (() => void)} fn
	*/
	function user_effect(fn) {
		validate_effect("$effect");
		var flags = active_effect.f;
		if (!active_reaction && (flags & 32) !== 0 && component_context !== null && !component_context.i) {
			var context = component_context;
			(context.e ??= []).push(fn);
		} else return create_user_effect(fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	*/
	function create_user_effect(fn) {
		return create_effect(4 | USER_EFFECT, fn);
	}
	/**
	* An effect root whose children can transition out
	* @param {() => void} fn
	* @returns {(options?: { outro?: boolean }) => Promise<void>}
	*/
	function component_root(fn) {
		Batch.ensure();
		const effect = create_effect(64 | EFFECT_PRESERVED, fn);
		return (options = {}) => {
			return new Promise((fulfil) => {
				if (options.outro) pause_effect(effect, () => {
					destroy_effect(effect);
					fulfil(void 0);
				});
				else {
					destroy_effect(effect);
					fulfil(void 0);
				}
			});
		};
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function async_effect(fn) {
		return create_effect(ASYNC | EFFECT_PRESERVED, fn);
	}
	/**
	* @param {() => void | (() => void)} fn
	* @returns {Effect}
	*/
	function render_effect(fn, flags = 0) {
		return create_effect(8 | flags, fn);
	}
	/**
	* @param {(...expressions: any) => void | (() => void)} fn
	* @param {Array<() => any>} sync
	* @param {Array<() => Promise<any>>} async
	* @param {Blocker[]} blockers
	*/
	function template_effect(fn, sync = [], async = [], blockers = []) {
		flatten(blockers, sync, async, (values) => {
			create_effect(8, () => {
				fn(...values.map(get));
			});
		});
	}
	/**
	* @param {(() => void)} fn
	* @param {number} flags
	*/
	function block(fn, flags = 0) {
		return create_effect(16 | flags, fn);
	}
	/**
	* @param {(() => void)} fn
	*/
	function branch(fn) {
		return create_effect(32 | EFFECT_PRESERVED, fn);
	}
	/**
	* @param {Effect} effect
	*/
	function execute_effect_teardown(effect) {
		var teardown = effect.teardown;
		if (teardown !== null) {
			const previously_destroying_effect = is_destroying_effect;
			const previous_reaction = active_reaction;
			set_is_destroying_effect(true);
			set_active_reaction(null);
			try {
				teardown.call(null);
			} finally {
				set_is_destroying_effect(previously_destroying_effect);
				set_active_reaction(previous_reaction);
			}
		}
	}
	/**
	* @param {Effect} signal
	* @param {boolean} remove_dom
	* @returns {void}
	*/
	function destroy_effect_children(signal, remove_dom = false) {
		var effect = signal.first;
		signal.first = signal.last = null;
		while (effect !== null) {
			const controller = effect.ac;
			if (controller !== null) without_reactive_context(() => {
				controller.abort(STALE_REACTION);
			});
			var next = effect.next;
			if ((effect.f & 64) !== 0) effect.parent = null;
			else destroy_effect(effect, remove_dom);
			effect = next;
		}
	}
	/**
	* @param {Effect} signal
	* @returns {void}
	*/
	function destroy_block_effect_children(signal) {
		var effect = signal.first;
		while (effect !== null) {
			var next = effect.next;
			if ((effect.f & 32) === 0) destroy_effect(effect);
			effect = next;
		}
	}
	/**
	* @param {Effect} effect
	* @param {boolean} [remove_dom]
	* @returns {void}
	*/
	function destroy_effect(effect, remove_dom = true) {
		var removed = false;
		if ((remove_dom || (effect.f & 262144) !== 0) && effect.nodes !== null && effect.nodes.end !== null) {
			remove_effect_dom(effect.nodes.start, effect.nodes.end);
			removed = true;
		}
		effect.f |= DESTROYING;
		destroy_effect_children(effect, remove_dom && !removed);
		remove_reactions(effect, 0);
		var transitions = effect.nodes && effect.nodes.t;
		if (transitions !== null) for (const transition of transitions) transition.stop();
		execute_effect_teardown(effect);
		effect.f ^= DESTROYING;
		effect.f |= DESTROYED;
		var parent = effect.parent;
		if (parent !== null && parent.first !== null) unlink_effect(effect);
		effect.next = effect.prev = effect.teardown = effect.ctx = effect.deps = effect.fn = effect.nodes = effect.ac = effect.b = null;
	}
	/**
	*
	* @param {TemplateNode | null} node
	* @param {TemplateNode} end
	*/
	function remove_effect_dom(node, end) {
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
			node.remove();
			node = next;
		}
	}
	/**
	* Detach an effect from the effect tree, freeing up memory and
	* reducing the amount of work that happens on subsequent traversals
	* @param {Effect} effect
	*/
	function unlink_effect(effect) {
		var parent = effect.parent;
		var prev = effect.prev;
		var next = effect.next;
		if (prev !== null) prev.next = next;
		if (next !== null) next.prev = prev;
		if (parent !== null) {
			if (parent.first === effect) parent.first = next;
			if (parent.last === effect) parent.last = prev;
		}
	}
	/**
	* When a block effect is removed, we don't immediately destroy it or yank it
	* out of the DOM, because it might have transitions. Instead, we 'pause' it.
	* It stays around (in memory, and in the DOM) until outro transitions have
	* completed, and if the state change is reversed then we _resume_ it.
	* A paused effect does not update, and the DOM subtree becomes inert.
	* @param {Effect} effect
	* @param {() => void} [callback]
	* @param {boolean} [destroy]
	*/
	function pause_effect(effect, callback, destroy = true) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		pause_children(effect, transitions, true);
		var fn = () => {
			if (destroy) destroy_effect(effect);
			if (callback) callback();
		};
		var remaining = transitions.length;
		if (remaining > 0) {
			var check = () => --remaining || fn();
			for (var transition of transitions) transition.out(check);
		} else fn();
	}
	/**
	* @param {Effect} effect
	* @param {TransitionManager[]} transitions
	* @param {boolean} local
	*/
	function pause_children(effect, transitions, local) {
		if ((effect.f & 8192) !== 0) return;
		effect.f ^= INERT;
		var t = effect.nodes && effect.nodes.t;
		if (t !== null) {
			for (const transition of t) if (transition.is_global || local) transitions.push(transition);
		}
		var child = effect.first;
		while (child !== null) {
			var sibling = child.next;
			if ((child.f & 64) === 0) {
				var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0 && (effect.f & 16) !== 0;
				pause_children(child, transitions, transparent ? local : false);
			}
			child = sibling;
		}
	}
	/**
	* The opposite of `pause_effect`. We call this if (for example)
	* `x` becomes falsy then truthy: `{#if x}...{/if}`
	* @param {Effect} effect
	*/
	function resume_effect(effect) {
		resume_children(effect, true);
	}
	/**
	* @param {Effect} effect
	* @param {boolean} local
	*/
	function resume_children(effect, local) {
		if ((effect.f & 8192) === 0) return;
		effect.f ^= INERT;
		if ((effect.f & 1024) === 0) {
			set_signal_status(effect, DIRTY);
			Batch.ensure().schedule(effect);
		}
		var child = effect.first;
		while (child !== null) {
			var sibling = child.next;
			var transparent = (child.f & 65536) !== 0 || (child.f & 32) !== 0;
			resume_children(child, transparent ? local : false);
			child = sibling;
		}
		var t = effect.nodes && effect.nodes.t;
		if (t !== null) {
			for (const transition of t) if (transition.is_global || local) transition.in();
		}
	}
	/**
	* @param {Effect} effect
	* @param {DocumentFragment} fragment
	*/
	function move_effect(effect, fragment) {
		if (!effect.nodes) return;
		/** @type {TemplateNode | null} */
		var node = effect.nodes.start;
		var end = effect.nodes.end;
		while (node !== null) {
			/** @type {TemplateNode | null} */
			var next = node === end ? null : /* @__PURE__ */ get_next_sibling(node);
			fragment.append(node);
			node = next;
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/legacy.js
	/**
	* @type {Set<Value> | null}
	* @deprecated
	*/
	var captured_signals = null;
	//#endregion
	//#region node_modules/svelte/src/internal/client/runtime.js
	/** @import { Derived, Effect, Reaction, Source, Value } from '#client' */
	/**
	* True if updating in an effect context that is reactive (i.e. not branch/root effects)
	*/
	var is_updating_effect = false;
	var is_destroying_effect = false;
	/** @param {boolean} value */
	function set_is_destroying_effect(value) {
		is_destroying_effect = value;
	}
	/** @type {null | Reaction} */
	var active_reaction = null;
	var untracking = false;
	/** @param {null | Reaction} reaction */
	function set_active_reaction(reaction) {
		active_reaction = reaction;
	}
	/** @type {null | Effect} */
	var active_effect = null;
	/** @param {null | Effect} effect */
	function set_active_effect(effect) {
		active_effect = effect;
	}
	/**
	* When sources are created within a reaction, reading and writing
	* them within that reaction should not cause a re-run
	* @type {null | Set<Source>}
	*/
	var current_sources = null;
	/** @param {Value} value */
	function push_reaction_value(value) {
		if (active_reaction !== null && (!async_mode_flag || (active_reaction.f & 2) !== 0)) (current_sources ??= /* @__PURE__ */ new Set()).add(value);
	}
	/**
	* The dependencies of the reaction that is currently being executed. In many cases,
	* the dependencies are unchanged between runs, and so this will be `null` unless
	* and until a new dependency is accessed — we track this via `skipped_deps`
	* @type {null | Value[]}
	*/
	var new_deps = null;
	var skipped_deps = 0;
	/**
	* Tracks writes that the effect it's executed in doesn't listen to yet,
	* so that the dependency can be added to the effect later on if it then reads it
	* @type {null | Source[]}
	*/
	var untracked_writes = null;
	/** @param {null | Source[]} value */
	function set_untracked_writes(value) {
		untracked_writes = value;
	}
	/**
	* @type {number} Used by sources and deriveds for handling updates.
	* Version starts from 1 so that unowned deriveds differentiate between a created effect and a run one for tracing
	**/
	var write_version = 1;
	/** @type {number} Used to version each read of a source of derived to avoid duplicating depedencies inside a reaction */
	var read_version = 0;
	var update_version = read_version;
	/** @param {number} value */
	function set_update_version(value) {
		update_version = value;
	}
	function increment_write_version() {
		return ++write_version;
	}
	/**
	* Determines whether a derived or effect is dirty.
	* If it is MAYBE_DIRTY, will set the status to CLEAN
	* @param {Reaction} reaction
	* @returns {boolean}
	*/
	function is_dirty(reaction) {
		var flags = reaction.f;
		if ((flags & 2048) !== 0) return true;
		if (flags & 2) reaction.f &= ~WAS_MARKED;
		if ((flags & 4096) !== 0) {
			var dependencies = reaction.deps;
			var length = dependencies.length;
			for (var i = 0; i < length; i++) {
				var dependency = dependencies[i];
				if (is_dirty(dependency)) update_derived(dependency);
				if (dependency.wv > reaction.wv) return true;
			}
			if ((flags & 512) !== 0 && batch_values === null) set_signal_status(reaction, CLEAN);
		}
		return false;
	}
	/**
	* @param {Value} signal
	* @param {Effect} effect
	* @param {boolean} [root]
	*/
	function schedule_possible_effect_self_invalidation(signal, effect, root = true) {
		var reactions = signal.reactions;
		if (reactions === null) return;
		if (!async_mode_flag && current_sources !== null && current_sources.has(signal)) return;
		for (var i = 0; i < reactions.length; i++) {
			var reaction = reactions[i];
			if ((reaction.f & 2) !== 0) schedule_possible_effect_self_invalidation(reaction, effect, false);
			else if (effect === reaction) {
				if (root) set_signal_status(reaction, DIRTY);
				else if ((reaction.f & 1024) !== 0) set_signal_status(reaction, MAYBE_DIRTY);
				schedule_effect(reaction);
			}
		}
	}
	/** @param {Reaction} reaction */
	function update_reaction(reaction) {
		var previous_deps = new_deps;
		var previous_skipped_deps = skipped_deps;
		var previous_untracked_writes = untracked_writes;
		var previous_reaction = active_reaction;
		var previous_sources = current_sources;
		var previous_component_context = component_context;
		var previous_untracking = untracking;
		var previous_update_version = update_version;
		var flags = reaction.f;
		new_deps = null;
		skipped_deps = 0;
		untracked_writes = null;
		active_reaction = (flags & 96) === 0 ? reaction : null;
		current_sources = null;
		set_component_context(reaction.ctx);
		untracking = false;
		update_version = ++read_version;
		if (reaction.ac !== null) {
			without_reactive_context(() => {
				/** @type {AbortController} */ reaction.ac.abort(STALE_REACTION);
			});
			reaction.ac = null;
		}
		try {
			reaction.f |= REACTION_IS_UPDATING;
			var fn = reaction.fn;
			var result = fn();
			reaction.f |= REACTION_RAN;
			var deps = reaction.deps;
			var is_fork = current_batch?.is_fork;
			if (new_deps !== null) {
				var i;
				if (!is_fork) remove_reactions(reaction, skipped_deps);
				if (deps !== null && skipped_deps > 0) {
					deps.length = skipped_deps + new_deps.length;
					for (i = 0; i < new_deps.length; i++) deps[skipped_deps + i] = new_deps[i];
				} else reaction.deps = deps = new_deps;
				if (effect_tracking() && (reaction.f & 512) !== 0) for (i = skipped_deps; i < deps.length; i++) (deps[i].reactions ??= []).push(reaction);
			} else if (!is_fork && deps !== null && skipped_deps < deps.length) {
				remove_reactions(reaction, skipped_deps);
				deps.length = skipped_deps;
			}
			if (is_runes() && untracked_writes !== null && !untracking && deps !== null && (reaction.f & 6146) === 0) for (i = 0; i < untracked_writes.length; i++) schedule_possible_effect_self_invalidation(untracked_writes[i], reaction);
			if (previous_reaction !== null && previous_reaction !== reaction) {
				read_version++;
				if (previous_reaction.deps !== null) for (let i = 0; i < previous_skipped_deps; i += 1) previous_reaction.deps[i].rv = read_version;
				if (previous_deps !== null) for (const dep of previous_deps) dep.rv = read_version;
				if (untracked_writes !== null) if (previous_untracked_writes === null) previous_untracked_writes = untracked_writes;
				else previous_untracked_writes.push(...untracked_writes);
			}
			if ((reaction.f & 8388608) !== 0) reaction.f ^= ERROR_VALUE;
			return result;
		} catch (error) {
			return handle_error(error);
		} finally {
			reaction.f ^= REACTION_IS_UPDATING;
			new_deps = previous_deps;
			skipped_deps = previous_skipped_deps;
			untracked_writes = previous_untracked_writes;
			active_reaction = previous_reaction;
			current_sources = previous_sources;
			set_component_context(previous_component_context);
			untracking = previous_untracking;
			update_version = previous_update_version;
		}
	}
	/**
	* @template V
	* @param {Reaction} signal
	* @param {Value<V>} dependency
	* @returns {void}
	*/
	function remove_reaction(signal, dependency) {
		let reactions = dependency.reactions;
		if (reactions !== null) {
			var index = index_of.call(reactions, signal);
			if (index !== -1) {
				var new_length = reactions.length - 1;
				if (new_length === 0) reactions = dependency.reactions = null;
				else {
					reactions[index] = reactions[new_length];
					reactions.pop();
				}
			}
		}
		if (reactions === null && (dependency.f & 2) !== 0 && (new_deps === null || !includes.call(new_deps, dependency))) {
			var derived = dependency;
			if ((derived.f & 512) !== 0) {
				derived.f ^= 512;
				derived.f &= ~WAS_MARKED;
			}
			if (derived.v !== UNINITIALIZED) update_derived_status(derived);
			if (derived.ac !== null) without_reactive_context(() => {
				/** @type {AbortController} */ derived.ac.abort(STALE_REACTION);
				derived.ac = null;
				set_signal_status(derived, DIRTY);
			});
			freeze_derived_effects(derived);
			remove_reactions(derived, 0);
		}
	}
	/**
	* @param {Reaction} signal
	* @param {number} start_index
	* @returns {void}
	*/
	function remove_reactions(signal, start_index) {
		var dependencies = signal.deps;
		if (dependencies === null) return;
		for (var i = start_index; i < dependencies.length; i++) remove_reaction(signal, dependencies[i]);
	}
	/**
	* @param {Effect} effect
	* @returns {void}
	*/
	function update_effect(effect) {
		var flags = effect.f;
		if ((flags & 16384) !== 0) return;
		set_signal_status(effect, CLEAN);
		var previous_effect = active_effect;
		var was_updating_effect = is_updating_effect;
		active_effect = effect;
		is_updating_effect = (flags & 96) === 0;
		try {
			if ((flags & 16777232) !== 0) destroy_block_effect_children(effect);
			else destroy_effect_children(effect);
			execute_effect_teardown(effect);
			var teardown = update_reaction(effect);
			effect.teardown = typeof teardown === "function" ? teardown : null;
			effect.wv = write_version;
		} finally {
			is_updating_effect = was_updating_effect;
			active_effect = previous_effect;
		}
	}
	/**
	* @template V
	* @param {Value<V>} signal
	* @returns {V}
	*/
	function get(signal) {
		var is_derived = (signal.f & 2) !== 0;
		captured_signals?.add(signal);
		if (active_reaction !== null && !untracking) {
			if (!(active_effect !== null && (active_effect.f & 16384) !== 0) && (current_sources === null || !current_sources.has(signal))) {
				var deps = active_reaction.deps;
				if ((active_reaction.f & 2097152) !== 0) {
					if (signal.rv < read_version) {
						signal.rv = read_version;
						if (new_deps === null && deps !== null && deps[skipped_deps] === signal) skipped_deps++;
						else if (new_deps === null) new_deps = [signal];
						else new_deps.push(signal);
					}
				} else {
					active_reaction.deps ??= [];
					if (!includes.call(active_reaction.deps, signal)) active_reaction.deps.push(signal);
					var reactions = signal.reactions;
					if (reactions === null) signal.reactions = [active_reaction];
					else if (!includes.call(reactions, active_reaction)) reactions.push(active_reaction);
				}
			}
		}
		if (is_destroying_effect && old_values.has(signal)) return old_values.get(signal);
		if (is_derived) {
			var derived = signal;
			if (is_destroying_effect) {
				var value = derived.v;
				if ((derived.f & 1024) === 0 && derived.reactions !== null || depends_on_old_values(derived)) value = execute_derived(derived);
				old_values.set(derived, value);
				return value;
			}
			var should_connect = (derived.f & 512) === 0 && !untracking && active_reaction !== null && (is_updating_effect || (active_reaction.f & 512) !== 0);
			var is_new = (derived.f & REACTION_RAN) === 0;
			if (is_dirty(derived)) {
				if (should_connect) derived.f |= 512;
				update_derived(derived);
			}
			if (should_connect && !is_new) {
				unfreeze_derived_effects(derived);
				reconnect(derived);
			}
		}
		if (batch_values?.has(signal)) return batch_values.get(signal);
		if ((signal.f & 8388608) !== 0) throw signal.v;
		return signal.v;
	}
	/**
	* (Re)connect a disconnected derived, so that it is notified
	* of changes in `mark_reactions`
	* @param {Derived} derived
	*/
	function reconnect(derived) {
		derived.f |= 512;
		if (derived.deps === null) return;
		for (const dep of derived.deps) {
			(dep.reactions ??= []).push(derived);
			if ((dep.f & 2) !== 0 && (dep.f & 512) === 0) {
				unfreeze_derived_effects(dep);
				reconnect(dep);
			}
		}
	}
	/** @param {Derived} derived */
	function depends_on_old_values(derived) {
		if (derived.v === UNINITIALIZED) return true;
		if (derived.deps === null) return false;
		for (const dep of derived.deps) {
			if (old_values.has(dep)) return true;
			if ((dep.f & 2) !== 0 && depends_on_old_values(dep)) return true;
		}
		return false;
	}
	/**
	* When used inside a [`$derived`](https://svelte.dev/docs/svelte/$derived) or [`$effect`](https://svelte.dev/docs/svelte/$effect),
	* any state read inside `fn` will not be treated as a dependency.
	*
	* ```ts
	* $effect(() => {
	*   // this will run when `data` changes, but not when `time` changes
	*   save(data, {
	*     timestamp: untrack(() => time)
	*   });
	* });
	* ```
	* @template T
	* @param {() => T} fn
	* @returns {T}
	*/
	function untrack(fn) {
		var previous_untracking = untracking;
		try {
			untracking = true;
			return fn();
		} finally {
			untracking = previous_untracking;
		}
	}
	/**
	* Subset of delegated events which should be passive by default.
	* These two are already passive via browser defaults on window, document and body.
	* But since
	* - we're delegating them
	* - they happen often
	* - they apply to mobile which is generally less performant
	* we're marking them as passive by default for other elements, too.
	*/
	var PASSIVE_EVENTS = ["touchstart", "touchmove"];
	/**
	* Returns `true` if `name` is a passive event
	* @param {string} name
	*/
	function is_passive_event(name) {
		return PASSIVE_EVENTS.includes(name);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/events.js
	/**
	* Used on elements, as a map of event type -> event handler,
	* and on events themselves to track which element handled an event
	*/
	var event_symbol = Symbol("events");
	/** @type {Set<string>} */
	var all_registered_events = /* @__PURE__ */ new Set();
	/** @type {Set<(events: Array<string>) => void>} */
	var root_event_handles = /* @__PURE__ */ new Set();
	/**
	* @param {string} event_name
	* @param {Element} element
	* @param {EventListener} [handler]
	* @returns {void}
	*/
	function delegated(event_name, element, handler) {
		(element[event_symbol] ??= {})[event_name] = handler;
	}
	/**
	* @param {Array<string>} events
	* @returns {void}
	*/
	function delegate(events) {
		for (var i = 0; i < events.length; i++) all_registered_events.add(events[i]);
		for (var fn of root_event_handles) fn(events);
	}
	var last_propagated_event = null;
	/**
	* @this {EventTarget}
	* @param {Event} event
	* @returns {void}
	*/
	function handle_event_propagation(event) {
		var handler_element = this;
		var owner_document = handler_element.ownerDocument;
		var event_name = event.type;
		var path = event.composedPath?.() || [];
		var current_target = path[0] || event.target;
		last_propagated_event = event;
		var path_idx = 0;
		var handled_at = last_propagated_event === event && event[event_symbol];
		if (handled_at) {
			var at_idx = path.indexOf(handled_at);
			if (at_idx !== -1 && (handler_element === document || handler_element === window)) {
				event[event_symbol] = handler_element;
				return;
			}
			var handler_idx = path.indexOf(handler_element);
			if (handler_idx === -1) return;
			if (at_idx <= handler_idx) path_idx = at_idx;
		}
		current_target = path[path_idx] || event.target;
		if (current_target === handler_element) return;
		define_property(event, "currentTarget", {
			configurable: true,
			get() {
				return current_target || owner_document;
			}
		});
		var previous_reaction = active_reaction;
		var previous_effect = active_effect;
		set_active_reaction(null);
		set_active_effect(null);
		try {
			/**
			* @type {unknown}
			*/
			var throw_error;
			/**
			* @type {unknown[]}
			*/
			var other_errors = [];
			while (current_target !== null) {
				if (current_target === handler_element) break;
				try {
					var delegated = current_target[event_symbol]?.[event_name];
					if (delegated != null && (!current_target.disabled || event.target === current_target)) delegated.call(current_target, event);
				} catch (error) {
					if (throw_error) other_errors.push(error);
					else throw_error = error;
				}
				if (event.cancelBubble) break;
				path_idx++;
				current_target = path_idx < path.length ? path[path_idx] : null;
			}
			if (throw_error) {
				for (let error of other_errors) queueMicrotask(() => {
					throw error;
				});
				throw throw_error;
			}
		} finally {
			event[event_symbol] = handler_element;
			delete event.currentTarget;
			set_active_reaction(previous_reaction);
			set_active_effect(previous_effect);
		}
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/reconciler.js
	var policy = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { 
	/** @param {string} html */
createHTML: (html) => {
		return html;
	} });
	/** @param {string} html */
	function create_trusted_html(html) {
		return policy?.createHTML(html) ?? html;
	}
	/**
	* @param {string} html
	*/
	function create_fragment_from_html(html) {
		var elem = create_element("template");
		elem.innerHTML = create_trusted_html(html.replaceAll("<!>", "<!---->"));
		return elem.content;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/template.js
	/** @import { Effect, EffectNodes, TemplateNode } from '#client' */
	/** @import { TemplateStructure } from './types' */
	/**
	* @param {TemplateNode} start
	* @param {TemplateNode | null} end
	*/
	function assign_nodes(start, end) {
		var effect = active_effect;
		if (effect.nodes === null) effect.nodes = {
			start,
			end,
			a: null,
			t: null
		};
	}
	/**
	* @param {string} content
	* @param {number} flags
	* @returns {() => Node | Node[]}
	*/
	/*#__NO_SIDE_EFFECTS__*/
	function from_html(content, flags) {
		var is_fragment = (flags & 1) !== 0;
		var use_import_node = (flags & 2) !== 0;
		/** @type {Node} */
		var node;
		/**
		* Whether or not the first item is a text/element node. If not, we need to
		* create an additional comment node to act as `effect.nodes.start`
		*/
		var has_start = !content.startsWith("<!>");
		return () => {
			if (hydrating) {
				assign_nodes(hydrate_node, null);
				return hydrate_node;
			}
			if (node === void 0) {
				node = create_fragment_from_html(has_start ? content : "<!>" + content);
				if (!is_fragment) node = /* @__PURE__ */ get_first_child(node);
			}
			var clone = use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true);
			if (is_fragment) {
				var start = /* @__PURE__ */ get_first_child(clone);
				var end = clone.lastChild;
				assign_nodes(start, end);
			} else assign_nodes(clone, clone);
			return clone;
		};
	}
	/**
	* Don't mark this as side-effect-free, hydration needs to walk all nodes
	* @param {any} value
	*/
	function text(value = "") {
		if (!hydrating) {
			var t = create_text(value + "");
			assign_nodes(t, t);
			return t;
		}
		var node = hydrate_node;
		if (node.nodeType !== 3) {
			node.before(node = create_text());
			set_hydrate_node(node);
		} else merge_text_nodes(node);
		assign_nodes(node, node);
		return node;
	}
	/**
	* @returns {TemplateNode | DocumentFragment}
	*/
	function comment() {
		if (hydrating) {
			assign_nodes(hydrate_node, null);
			return hydrate_node;
		}
		var frag = document.createDocumentFragment();
		var start = document.createComment("");
		var anchor = create_text();
		frag.append(start, anchor);
		assign_nodes(start, anchor);
		return frag;
	}
	/**
	* Assign the created (or in hydration mode, traversed) dom elements to the current block
	* and insert the elements into the dom (in client mode).
	* @param {Text | Comment | Element} anchor
	* @param {DocumentFragment | Element} dom
	*/
	function append(anchor, dom) {
		if (hydrating) {
			var effect = active_effect;
			if ((effect.f & 32768) === 0 || effect.nodes.end === null) effect.nodes.end = hydrate_node;
			hydrate_next();
			return;
		}
		if (anchor === null) return;
		anchor.before(dom);
	}
	/**
	* @param {Element} text
	* @param {string} value
	* @returns {void}
	*/
	function set_text(text, value) {
		var str = value == null ? "" : typeof value === "object" ? `${value}` : value;
		if (str !== (text[TEXT_CACHE] ??= text.nodeValue)) {
			/** @type {any} */ text[TEXT_CACHE] = str;
			text.nodeValue = `${str}`;
		}
	}
	/**
	* Mounts a component to the given target and returns the exports and potentially the props (if compiled with `accessors: true`) of the component.
	* Transitions will play during the initial render unless the `intro` option is set to `false`.
	*
	* @template {Record<string, any>} Props
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<Props>> | Component<Props, Exports, any>} component
	* @param {MountOptions<Props>} options
	* @returns {Exports}
	*/
	function mount(component, options) {
		return _mount(component, options);
	}
	/** @type {Map<EventTarget, Map<string, number>>} */
	var listeners = /* @__PURE__ */ new Map();
	/**
	* @template {Record<string, any>} Exports
	* @param {ComponentType<SvelteComponent<any>> | Component<any>} Component
	* @param {MountOptions} options
	* @returns {Exports}
	*/
	function _mount(Component, { target, anchor, props = {}, events, context, intro = true, transformError }) {
		init_operations();
		/** @type {Exports} */
		var component = void 0;
		var unmount = component_root(() => {
			var anchor_node = anchor ?? target.appendChild(create_text());
			boundary(anchor_node, { pending: () => {} }, (anchor_node) => {
				push({});
				var ctx = component_context;
				if (context) ctx.c = context;
				if (events)
 /** @type {any} */ props.$$events = events;
				if (hydrating) assign_nodes(anchor_node, null);
				component = Component(anchor_node, props) || {};
				if (hydrating) {
					/** @type {Effect & { nodes: EffectNodes }} */ active_effect.nodes.end = hydrate_node;
					if (hydrate_node === null || hydrate_node.nodeType !== 8 || hydrate_node.data !== "]") {
						hydration_mismatch();
						throw HYDRATION_ERROR;
					}
				}
				pop();
			}, transformError);
			/** @type {Set<string>} */
			var registered_events = /* @__PURE__ */ new Set();
			/** @param {Array<string>} events */
			var event_handle = (events) => {
				for (var i = 0; i < events.length; i++) {
					var event_name = events[i];
					if (registered_events.has(event_name)) continue;
					registered_events.add(event_name);
					var passive = is_passive_event(event_name);
					for (const node of [target, document]) {
						var counts = listeners.get(node);
						if (counts === void 0) {
							counts = /* @__PURE__ */ new Map();
							listeners.set(node, counts);
						}
						var count = counts.get(event_name);
						if (count === void 0) {
							node.addEventListener(event_name, handle_event_propagation, { passive });
							counts.set(event_name, 1);
						} else counts.set(event_name, count + 1);
					}
				}
			};
			event_handle(array_from(all_registered_events));
			root_event_handles.add(event_handle);
			return () => {
				for (var event_name of registered_events) for (const node of [target, document]) {
					var counts = listeners.get(node);
					var count = counts.get(event_name);
					if (--count == 0) {
						node.removeEventListener(event_name, handle_event_propagation);
						counts.delete(event_name);
						if (counts.size === 0) listeners.delete(node);
					} else counts.set(event_name, count);
				}
				root_event_handles.delete(event_handle);
				if (anchor_node !== anchor) anchor_node.parentNode?.removeChild(anchor_node);
			};
		});
		mounted_components.set(component, unmount);
		return component;
	}
	/**
	* References of the components that were mounted or hydrated.
	* Uses a `WeakMap` to avoid memory leaks.
	*/
	var mounted_components = /* @__PURE__ */ new WeakMap();
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/branches.js
	/** @import { Effect, TemplateNode } from '#client' */
	/**
	* @typedef {{ effect: Effect, fragment: DocumentFragment }} Branch
	*/
	/**
	* @template Key
	*/
	var BranchManager = class {
		/** @type {TemplateNode} */
		anchor;
		/** @type {Map<Batch, Key>} */
		#batches = /* @__PURE__ */ new Map();
		/**
		* Map of keys to effects that are currently rendered in the DOM.
		* These effects are visible and actively part of the document tree.
		* Example:
		* ```
		* {#if condition}
		* 	foo
		* {:else}
		* 	bar
		* {/if}
		* ```
		* Can result in the entries `true->Effect` and `false->Effect`
		* @type {Map<Key, Effect>}
		*/
		#onscreen = /* @__PURE__ */ new Map();
		/**
		* Similar to #onscreen with respect to the keys, but contains branches that are not yet
		* in the DOM, because their insertion is deferred.
		* @type {Map<Key, Branch>}
		*/
		#offscreen = /* @__PURE__ */ new Map();
		/**
		* Keys of effects that are currently outroing
		* @type {Set<Key>}
		*/
		#outroing = /* @__PURE__ */ new Set();
		/**
		* Whether to pause (i.e. outro) on change, or destroy immediately.
		* This is necessary for `<svelte:element>`
		*/
		#transition = true;
		/**
		* @param {TemplateNode} anchor
		* @param {boolean} transition
		*/
		constructor(anchor, transition = true) {
			this.anchor = anchor;
			this.#transition = transition;
		}
		/**
		* @param {Batch} batch
		*/
		#commit = (batch) => {
			if (!this.#batches.has(batch)) return;
			var key = this.#batches.get(batch);
			var onscreen = this.#onscreen.get(key);
			if (onscreen) {
				resume_effect(onscreen);
				this.#outroing.delete(key);
			} else {
				var offscreen = this.#offscreen.get(key);
				if (offscreen) {
					resume_effect(offscreen.effect);
					this.#onscreen.set(key, offscreen.effect);
					this.#offscreen.delete(key);
					/** @type {TemplateNode} */ offscreen.fragment.lastChild.remove();
					this.anchor.before(offscreen.fragment);
					onscreen = offscreen.effect;
				}
			}
			for (const [b, k] of this.#batches) {
				this.#batches.delete(b);
				if (b === batch) break;
				const offscreen = this.#offscreen.get(k);
				if (offscreen) {
					destroy_effect(offscreen.effect);
					this.#offscreen.delete(k);
				}
			}
			for (const [k, effect] of this.#onscreen) {
				if (k === key || this.#outroing.has(k)) continue;
				const on_destroy = () => {
					if (Array.from(this.#batches.values()).includes(k)) {
						var fragment = document.createDocumentFragment();
						move_effect(effect, fragment);
						fragment.append(create_text());
						this.#offscreen.set(k, {
							effect,
							fragment
						});
					} else destroy_effect(effect);
					this.#outroing.delete(k);
					this.#onscreen.delete(k);
				};
				if (this.#transition || !onscreen) {
					this.#outroing.add(k);
					pause_effect(effect, on_destroy, false);
				} else on_destroy();
			}
		};
		/**
		* @param {Batch} batch
		*/
		#discard = (batch) => {
			this.#batches.delete(batch);
			const keys = Array.from(this.#batches.values());
			for (const [k, branch] of this.#offscreen) if (!keys.includes(k)) {
				destroy_effect(branch.effect);
				this.#offscreen.delete(k);
			}
		};
		/**
		*
		* @param {any} key
		* @param {null | ((target: TemplateNode) => void)} fn
		*/
		ensure(key, fn) {
			var batch = current_batch;
			var defer = should_defer_append();
			if (fn && !this.#onscreen.has(key) && !this.#offscreen.has(key)) if (defer) {
				var fragment = document.createDocumentFragment();
				var target = create_text();
				fragment.append(target);
				this.#offscreen.set(key, {
					effect: branch(() => fn(target)),
					fragment
				});
			} else this.#onscreen.set(key, branch(() => fn(this.anchor)));
			this.#batches.set(batch, key);
			if (defer) {
				for (const [k, effect] of this.#onscreen) if (k === key) batch.unskip_effect(effect);
				else batch.skip_effect(effect);
				for (const [k, branch] of this.#offscreen) if (k === key) batch.unskip_effect(branch.effect);
				else batch.skip_effect(branch.effect);
				batch.oncommit(this.#commit);
				batch.ondiscard(this.#discard);
			} else {
				if (hydrating) this.anchor = hydrate_node;
				this.#commit(batch);
			}
		}
	};
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
	/** @import { TemplateNode } from '#client' */
	/**
	* @param {TemplateNode} node
	* @param {(branch: (fn: (anchor: Node) => void, key?: number | false) => void) => void} fn
	* @param {boolean} [elseif] True if this is an `{:else if ...}` block rather than an `{#if ...}`, as that affects which transitions are considered 'local'
	* @returns {void}
	*/
	function if_block(node, fn, elseif = false) {
		/** @type {TemplateNode | undefined} */
		var marker;
		if (hydrating) {
			marker = hydrate_node;
			hydrate_next();
		}
		var branches = new BranchManager(node);
		var flags = elseif ? EFFECT_TRANSPARENT : 0;
		/**
		* @param {number | false} key
		* @param {null | ((anchor: Node) => void)} fn
		*/
		function update_branch(key, fn) {
			if (hydrating) {
				var data = read_hydration_instruction(marker);
				if (key !== parseInt(data.substring(1))) {
					var anchor = skip_nodes();
					set_hydrate_node(anchor);
					branches.anchor = anchor;
					set_hydrating(false);
					branches.ensure(key, fn);
					set_hydrating(true);
					return;
				}
			}
			branches.ensure(key, fn);
		}
		block(() => {
			var has_branch = false;
			fn((fn, key = 0) => {
				has_branch = true;
				update_branch(key, fn);
			});
			if (!has_branch) update_branch(-1, null);
		}, flags);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
	/** @import { EachItem, EachOutroGroup, EachState, Effect, EffectNodes, MaybeSource, Source, TemplateNode, TransitionManager, Value } from '#client' */
	/** @import { Batch } from '../../reactivity/batch.js'; */
	/**
	* @param {any} _
	* @param {number} i
	*/
	function index(_, i) {
		return i;
	}
	/**
	* Pause multiple effects simultaneously, and coordinate their
	* subsequent destruction. Used in each blocks
	* @param {EachState} state
	* @param {Effect[]} to_destroy
	* @param {null | Node} controlled_anchor
	*/
	function pause_effects(state, to_destroy, controlled_anchor) {
		/** @type {TransitionManager[]} */
		var transitions = [];
		var length = to_destroy.length;
		/** @type {EachOutroGroup} */
		var group;
		var remaining = to_destroy.length;
		for (var i = 0; i < length; i++) {
			let effect = to_destroy[i];
			pause_effect(effect, () => {
				if (group) {
					group.pending.delete(effect);
					group.done.add(effect);
					if (group.pending.size === 0) {
						var groups = state.outrogroups;
						destroy_effects(state, array_from(group.done));
						groups.delete(group);
						if (groups.size === 0) state.outrogroups = null;
					}
				} else remaining -= 1;
			}, false);
		}
		if (remaining === 0) {
			var fast_path = transitions.length === 0 && controlled_anchor !== null;
			if (fast_path) {
				var anchor = controlled_anchor;
				var parent_node = anchor.parentNode;
				clear_text_content(parent_node);
				parent_node.append(anchor);
				state.items.clear();
			}
			destroy_effects(state, to_destroy, !fast_path);
		} else {
			group = {
				pending: new Set(to_destroy),
				done: /* @__PURE__ */ new Set()
			};
			(state.outrogroups ??= /* @__PURE__ */ new Set()).add(group);
		}
	}
	/**
	* @param {EachState} state
	* @param {Effect[]} to_destroy
	* @param {boolean} remove_dom
	*/
	function destroy_effects(state, to_destroy, remove_dom = true) {
		/** @type {Set<Effect> | undefined} */
		var preserved_effects;
		if (state.pending.size > 0) {
			preserved_effects = /* @__PURE__ */ new Set();
			for (const keys of state.pending.values()) for (const key of keys) preserved_effects.add(
				/** @type {EachItem} */
				state.items.get(key).e
			);
		}
		for (var i = 0; i < to_destroy.length; i++) {
			var e = to_destroy[i];
			if (preserved_effects?.has(e)) {
				e.f |= EFFECT_OFFSCREEN;
				move_effect(e, document.createDocumentFragment());
			} else destroy_effect(to_destroy[i], remove_dom);
		}
	}
	/** @type {TemplateNode} */
	var offscreen_anchor;
	/**
	* @template V
	* @param {Element | Comment} node The next sibling node, or the parent node if this is a 'controlled' block
	* @param {number} flags
	* @param {() => V[]} get_collection
	* @param {(value: V, index: number) => any} get_key
	* @param {(anchor: Node, item: MaybeSource<V>, index: MaybeSource<number>) => void} render_fn
	* @param {null | ((anchor: Node) => void)} fallback_fn
	* @returns {void}
	*/
	function each(node, flags, get_collection, get_key, render_fn, fallback_fn = null) {
		var anchor = node;
		/** @type {Map<any, EachItem>} */
		var items = /* @__PURE__ */ new Map();
		if ((flags & 4) !== 0) {
			var parent_node = node;
			anchor = hydrating ? set_hydrate_node(/* @__PURE__ */ get_first_child(parent_node)) : parent_node.appendChild(create_text());
		}
		if (hydrating) hydrate_next();
		/** @type {Effect | null} */
		var fallback = null;
		var each_array = /* @__PURE__ */ derived_safe_equal(() => {
			var collection = get_collection();
			return is_array(collection) ? collection : collection == null ? [] : array_from(collection);
		});
		/** @type {V[]} */
		var array;
		/** @type {Map<Batch, Set<any>>} */
		var pending = /* @__PURE__ */ new Map();
		var first_run = true;
		/**
		* @param {Batch} batch
		*/
		function commit(batch) {
			if ((state.effect.f & 16384) !== 0) return;
			state.pending.delete(batch);
			state.fallback = fallback;
			reconcile(state, array, anchor, flags, get_key);
			if (fallback !== null) if (array.length === 0) if ((fallback.f & 33554432) === 0) resume_effect(fallback);
			else {
				fallback.f ^= EFFECT_OFFSCREEN;
				move(fallback, null, anchor);
			}
			else pause_effect(fallback, () => {
				fallback = null;
			});
		}
		/**
		* @param {Batch} batch
		*/
		function discard(batch) {
			state.pending.delete(batch);
		}
		/** @type {EachState} */
		var state = {
			effect: block(() => {
				array = get(each_array);
				var length = array.length;
				/** `true` if there was a hydration mismatch. Needs to be a `let` or else it isn't treeshaken out */
				let mismatch = false;
				if (hydrating) {
					if (read_hydration_instruction(anchor) === "[!" !== (length === 0)) {
						anchor = skip_nodes();
						set_hydrate_node(anchor);
						set_hydrating(false);
						mismatch = true;
					}
				}
				var keys = /* @__PURE__ */ new Set();
				var batch = current_batch;
				var defer = should_defer_append();
				for (var index = 0; index < length; index += 1) {
					if (hydrating && hydrate_node.nodeType === 8 && hydrate_node.data === "]") {
						anchor = hydrate_node;
						mismatch = true;
						set_hydrating(false);
					}
					var value = array[index];
					var key = get_key(value, index);
					var item = first_run ? null : items.get(key);
					if (item) {
						if (item.v) internal_set(item.v, value);
						if (item.i) internal_set(item.i, index);
						if (defer) batch.unskip_effect(item.e);
					} else {
						item = create_item(items, first_run ? anchor : offscreen_anchor ??= create_text(), value, key, index, render_fn, flags, get_collection);
						if (!first_run) item.e.f |= EFFECT_OFFSCREEN;
						items.set(key, item);
					}
					keys.add(key);
				}
				if (length === 0 && fallback_fn && !fallback) if (first_run) fallback = branch(() => fallback_fn(anchor));
				else {
					fallback = branch(() => fallback_fn(offscreen_anchor ??= create_text()));
					fallback.f |= EFFECT_OFFSCREEN;
				}
				if (length > keys.size) each_key_duplicate("", "", "");
				if (hydrating && length > 0) set_hydrate_node(skip_nodes());
				if (!first_run) {
					pending.set(batch, keys);
					if (defer) {
						for (const [key, item] of items) if (!keys.has(key)) batch.skip_effect(item.e);
						batch.oncommit(commit);
						batch.ondiscard(discard);
					} else commit(batch);
				}
				if (mismatch) set_hydrating(true);
				get(each_array);
			}),
			flags,
			items,
			pending,
			outrogroups: null,
			fallback
		};
		first_run = false;
		if (hydrating) anchor = hydrate_node;
	}
	/**
	* Skip past any non-branch effects (which could be created with `createSubscriber`, for example) to find the next branch effect
	* @param {Effect | null} effect
	* @returns {Effect | null}
	*/
	function skip_to_branch(effect) {
		while (effect !== null && (effect.f & 32) === 0) effect = effect.next;
		return effect;
	}
	/**
	* Add, remove, or reorder items output by an each block as its input changes
	* @template V
	* @param {EachState} state
	* @param {Array<V>} array
	* @param {Element | Comment | Text} anchor
	* @param {number} flags
	* @param {(value: V, index: number) => any} get_key
	* @returns {void}
	*/
	function reconcile(state, array, anchor, flags, get_key) {
		var is_animated = (flags & 8) !== 0;
		var length = array.length;
		var items = state.items;
		var current = skip_to_branch(state.effect.first);
		/** @type {undefined | Set<Effect>} */
		var seen;
		/** @type {Effect | null} */
		var prev = null;
		/** @type {undefined | Set<Effect>} */
		var to_animate;
		/** @type {Effect[]} */
		var matched = [];
		/** @type {Effect[]} */
		var stashed = [];
		/** @type {V} */
		var value;
		/** @type {any} */
		var key;
		/** @type {Effect | undefined} */
		var effect;
		/** @type {number} */
		var i;
		if (is_animated) for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);
			effect = items.get(key).e;
			if ((effect.f & 33554432) === 0) {
				effect.nodes?.a?.measure();
				(to_animate ??= /* @__PURE__ */ new Set()).add(effect);
			}
		}
		for (i = 0; i < length; i += 1) {
			value = array[i];
			key = get_key(value, i);
			effect = items.get(key).e;
			if (state.outrogroups !== null) for (const group of state.outrogroups) {
				group.pending.delete(effect);
				group.done.delete(effect);
			}
			if ((effect.f & 8192) !== 0) {
				resume_effect(effect);
				if (is_animated) {
					effect.nodes?.a?.unfix();
					(to_animate ??= /* @__PURE__ */ new Set()).delete(effect);
				}
			}
			if ((effect.f & 33554432) !== 0) {
				effect.f ^= EFFECT_OFFSCREEN;
				if (effect === current) move(effect, null, anchor);
				else {
					var next = prev ? prev.next : current;
					if (effect === state.effect.last) state.effect.last = effect.prev;
					if (effect.prev) effect.prev.next = effect.next;
					if (effect.next) effect.next.prev = effect.prev;
					link(state, prev, effect);
					link(state, effect, next);
					move(effect, next, anchor);
					prev = effect;
					matched = [];
					stashed = [];
					current = skip_to_branch(prev.next);
					continue;
				}
			}
			if (effect !== current) {
				if (seen !== void 0 && seen.has(effect)) {
					if (matched.length < stashed.length) {
						var start = stashed[0];
						var j;
						prev = start.prev;
						var a = matched[0];
						var b = matched[matched.length - 1];
						for (j = 0; j < matched.length; j += 1) move(matched[j], start, anchor);
						for (j = 0; j < stashed.length; j += 1) seen.delete(stashed[j]);
						link(state, a.prev, b.next);
						link(state, prev, a);
						link(state, b, start);
						current = start;
						prev = b;
						i -= 1;
						matched = [];
						stashed = [];
					} else {
						seen.delete(effect);
						move(effect, current, anchor);
						link(state, effect.prev, effect.next);
						link(state, effect, prev === null ? state.effect.first : prev.next);
						link(state, prev, effect);
						prev = effect;
					}
					continue;
				}
				matched = [];
				stashed = [];
				while (current !== null && current !== effect) {
					(seen ??= /* @__PURE__ */ new Set()).add(current);
					stashed.push(current);
					current = skip_to_branch(current.next);
				}
				if (current === null) continue;
			}
			if ((effect.f & 33554432) === 0) matched.push(effect);
			prev = effect;
			current = skip_to_branch(effect.next);
		}
		if (state.outrogroups !== null) {
			for (const group of state.outrogroups) if (group.pending.size === 0) {
				destroy_effects(state, array_from(group.done));
				state.outrogroups?.delete(group);
			}
			if (state.outrogroups.size === 0) state.outrogroups = null;
		}
		if (current !== null || seen !== void 0) {
			/** @type {Effect[]} */
			var to_destroy = [];
			if (seen !== void 0) {
				for (effect of seen) if ((effect.f & 8192) === 0) to_destroy.push(effect);
			}
			while (current !== null) {
				if ((current.f & 8192) === 0 && current !== state.fallback) to_destroy.push(current);
				current = skip_to_branch(current.next);
			}
			var destroy_length = to_destroy.length;
			if (destroy_length > 0) {
				var controlled_anchor = (flags & 4) !== 0 && length === 0 ? anchor : null;
				if (is_animated) {
					for (i = 0; i < destroy_length; i += 1) to_destroy[i].nodes?.a?.measure();
					for (i = 0; i < destroy_length; i += 1) to_destroy[i].nodes?.a?.fix();
				}
				pause_effects(state, to_destroy, controlled_anchor);
			}
		}
		if (is_animated) queue_micro_task(() => {
			if (to_animate === void 0) return;
			for (effect of to_animate) effect.nodes?.a?.apply();
		});
	}
	/**
	* @template V
	* @param {Map<any, EachItem>} items
	* @param {Node} anchor
	* @param {V} value
	* @param {unknown} key
	* @param {number} index
	* @param {(anchor: Node, item: V | Source<V>, index: number | Value<number>, collection: () => V[]) => void} render_fn
	* @param {number} flags
	* @param {() => V[]} get_collection
	* @returns {EachItem}
	*/
	function create_item(items, anchor, value, key, index, render_fn, flags, get_collection) {
		var v = (flags & 1) !== 0 ? (flags & 16) === 0 ? /* @__PURE__ */ mutable_source(value, false, false) : source(value) : null;
		var i = (flags & 2) !== 0 ? source(index) : null;
		return {
			v,
			i,
			e: branch(() => {
				render_fn(anchor, v ?? value, i ?? index, get_collection);
				return () => {
					items.delete(key);
				};
			})
		};
	}
	/**
	* @param {Effect} effect
	* @param {Effect | null} next
	* @param {Text | Element | Comment} anchor
	*/
	function move(effect, next, anchor) {
		if (!effect.nodes) return;
		var node = effect.nodes.start;
		var end = effect.nodes.end;
		var dest = next && (next.f & 33554432) === 0 ? next.nodes.start : anchor;
		while (node !== null) {
			var next_node = /* @__PURE__ */ get_next_sibling(node);
			dest.before(node);
			if (node === end) return;
			node = next_node;
		}
	}
	/**
	* @param {EachState} state
	* @param {Effect | null} prev
	* @param {Effect | null} next
	*/
	function link(state, prev, next) {
		if (prev === null) state.effect.first = next;
		else prev.next = next;
		if (next === null) state.effect.last = prev;
		else next.prev = prev;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/shared/attributes.js
	var whitespace = [..." 	\n\r\f\xA0\v﻿"];
	/**
	* @param {any} value
	* @param {string | null} [hash]
	* @param {Record<string, boolean>} [directives]
	* @returns {string | null}
	*/
	function to_class(value, hash, directives) {
		var classname = value == null ? "" : "" + value;
		if (hash) classname = classname ? classname + " " + hash : hash;
		if (directives) {
			for (var key of Object.keys(directives)) if (directives[key]) classname = classname ? classname + " " + key : key;
			else if (classname.length) {
				var len = key.length;
				var a = 0;
				while ((a = classname.indexOf(key, a)) >= 0) {
					var b = a + len;
					if ((a === 0 || whitespace.includes(classname[a - 1])) && (b === classname.length || whitespace.includes(classname[b]))) classname = (a === 0 ? "" : classname.substring(0, a)) + classname.substring(b + 1);
					else a = b;
				}
			}
		}
		return classname === "" ? null : classname;
	}
	/**
	*
	* @param {Record<string,any>} styles
	* @param {boolean} important
	*/
	function append_styles(styles, important = false) {
		var separator = important ? " !important;" : ";";
		var css = "";
		for (var key of Object.keys(styles)) {
			var value = styles[key];
			if (value != null && value !== "") css += " " + key + ": " + value + separator;
		}
		return css;
	}
	/**
	* @param {string} name
	* @returns {string}
	*/
	function to_css_name(name) {
		if (name[0] !== "-" || name[1] !== "-") return name.toLowerCase();
		return name;
	}
	/**
	* @param {any} value
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [styles]
	* @returns {string | null}
	*/
	function to_style(value, styles) {
		if (styles) {
			var new_style = "";
			/** @type {Record<string,any> | undefined} */
			var normal_styles;
			/** @type {Record<string,any> | undefined} */
			var important_styles;
			if (Array.isArray(styles)) {
				normal_styles = styles[0];
				important_styles = styles[1];
			} else normal_styles = styles;
			if (value) {
				value = String(value).replaceAll(/\s*\/\*.*?\*\/\s*/g, "").trim();
				/** @type {boolean | '"' | "'"} */
				var in_str = false;
				var in_apo = 0;
				var in_comment = false;
				var reserved_names = [];
				if (normal_styles) reserved_names.push(...Object.keys(normal_styles).map(to_css_name));
				if (important_styles) reserved_names.push(...Object.keys(important_styles).map(to_css_name));
				var start_index = 0;
				var name_index = -1;
				const len = value.length;
				for (var i = 0; i < len; i++) {
					var c = value[i];
					if (in_comment) {
						if (c === "/" && value[i - 1] === "*") in_comment = false;
					} else if (in_str) {
						if (in_str === c) in_str = false;
					} else if (c === "/" && value[i + 1] === "*") in_comment = true;
					else if (c === "\"" || c === "'") in_str = c;
					else if (c === "(") in_apo++;
					else if (c === ")") in_apo--;
					if (!in_comment && in_str === false && in_apo === 0) {
						if (c === ":" && name_index === -1) name_index = i;
						else if (c === ";" || i === len - 1) {
							if (name_index !== -1) {
								var name = to_css_name(value.substring(start_index, name_index).trim());
								if (!reserved_names.includes(name)) {
									if (c !== ";") i++;
									var property = value.substring(start_index, i).trim();
									new_style += " " + property + ";";
								}
							}
							start_index = i + 1;
							name_index = -1;
						}
					}
				}
			}
			if (normal_styles) new_style += append_styles(normal_styles);
			if (important_styles) new_style += append_styles(important_styles, true);
			new_style = new_style.trim();
			return new_style === "" ? null : new_style;
		}
		return value == null ? null : String(value);
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/class.js
	/**
	* @param {Element} dom
	* @param {boolean | number} is_html
	* @param {string | null} value
	* @param {string} [hash]
	* @param {Record<string, any>} [prev_classes]
	* @param {Record<string, any>} [next_classes]
	* @returns {Record<string, boolean> | undefined}
	*/
	function set_class(dom, is_html, value, hash, prev_classes, next_classes) {
		var prev = dom[CLASS_CACHE];
		if (hydrating || prev !== value || prev === void 0) {
			var next_class_name = to_class(value, hash, next_classes);
			if (!hydrating || next_class_name !== dom.getAttribute("class")) if (next_class_name == null) dom.removeAttribute("class");
			else if (is_html) dom.className = next_class_name;
			else dom.setAttribute("class", next_class_name);
			/** @type {any} */ dom[CLASS_CACHE] = value;
		} else if (next_classes && prev_classes !== next_classes) for (var key in next_classes) {
			var is_present = !!next_classes[key];
			if (prev_classes == null || is_present !== !!prev_classes[key]) dom.classList.toggle(key, is_present);
		}
		return next_classes;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/dom/elements/style.js
	/**
	* @param {Element & ElementCSSInlineStyle} dom
	* @param {Record<string, any>} prev
	* @param {Record<string, any>} next
	* @param {string} [priority]
	*/
	function update_styles(dom, prev = {}, next, priority) {
		for (var key in next) {
			var value = next[key];
			if (prev[key] !== value) if (next[key] == null) dom.style.removeProperty(key);
			else dom.style.setProperty(key, value, priority);
		}
	}
	/**
	* @param {Element & ElementCSSInlineStyle} dom
	* @param {string | null} value
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [prev_styles]
	* @param {Record<string, any> | [Record<string, any>, Record<string, any>]} [next_styles]
	*/
	function set_style(dom, value, prev_styles, next_styles) {
		var prev = dom[STYLE_CACHE];
		if (hydrating || prev !== value) {
			var next_style_attr = to_style(value, next_styles);
			if (!hydrating || next_style_attr !== dom.getAttribute("style")) if (next_style_attr == null) dom.removeAttribute("style");
			else dom.style.cssText = next_style_attr;
			/** @type {any} */ dom[STYLE_CACHE] = value;
		} else if (next_styles) if (Array.isArray(next_styles)) {
			update_styles(dom, prev_styles?.[0], next_styles[0]);
			update_styles(dom, prev_styles?.[1], next_styles[1], "important");
		} else update_styles(dom, prev_styles, next_styles);
		return next_styles;
	}
	//#endregion
	//#region node_modules/svelte/src/internal/client/reactivity/props.js
	/** @import { Derived, Effect, Source } from './types.js' */
	/**
	* This function is responsible for synchronizing a possibly bound prop with the inner component state.
	* It is used whenever the compiler sees that the component writes to the prop, or when it has a default prop_value.
	* @template V
	* @param {Record<string, unknown>} props
	* @param {string} key
	* @param {number} flags
	* @param {V | (() => V)} [fallback]
	* @returns {(() => V | ((arg: V) => V) | ((arg: V, mutation: boolean) => V))}
	*/
	function prop(props, key, flags, fallback) {
		var runes = !legacy_mode_flag || (flags & 2) !== 0;
		var bindable = (flags & 8) !== 0;
		var lazy = (flags & 16) !== 0;
		var fallback_value = fallback;
		var fallback_dirty = true;
		var fallback_signal = void 0;
		var get_fallback = () => {
			if (lazy && runes) {
				fallback_signal ??= /* @__PURE__ */ derived(fallback);
				return get(fallback_signal);
			}
			if (fallback_dirty) {
				fallback_dirty = false;
				fallback_value = lazy ? untrack(fallback) : fallback;
			}
			return fallback_value;
		};
		/** @type {((v: V) => void) | undefined} */
		let setter;
		if (bindable) {
			var is_entry_props = STATE_SYMBOL in props || LEGACY_PROPS in props;
			setter = get_descriptor(props, key)?.set ?? (is_entry_props && key in props ? (v) => props[key] = v : void 0);
		}
		/** @type {V} */
		var initial_value;
		var is_store_sub = false;
		if (bindable) [initial_value, is_store_sub] = capture_store_binding(() => props[key]);
		else initial_value = props[key];
		if (initial_value === void 0 && fallback !== void 0) {
			initial_value = get_fallback();
			if (setter) {
				if (runes) props_invalid_value(key);
				setter(initial_value);
			}
		}
		/** @type {() => V} */
		var getter;
		if (runes) getter = () => {
			var value = props[key];
			if (value === void 0) return get_fallback();
			fallback_dirty = true;
			return value;
		};
		else getter = () => {
			var value = props[key];
			if (value !== void 0) fallback_value = void 0;
			return value === void 0 ? fallback_value : value;
		};
		if (runes && (flags & 4) === 0) return getter;
		if (setter) {
			var legacy_parent = props.$$legacy;
			return (function(value, mutation) {
				if (arguments.length > 0) {
					if (!runes || !mutation || legacy_parent || is_store_sub)
 /** @type {Function} */ setter(mutation ? getter() : value);
					return value;
				}
				return getter();
			});
		}
		var overridden = false;
		var d = ((flags & 1) !== 0 ? derived : derived_safe_equal)(() => {
			overridden = false;
			return getter();
		});
		if (bindable) get(d);
		var parent_effect = active_effect;
		return (function(value, mutation) {
			if (arguments.length > 0) {
				const new_value = mutation ? get(d) : runes && bindable ? proxy(value) : value;
				set(d, new_value);
				overridden = true;
				if (fallback_value !== void 0) fallback_value = new_value;
				return value;
			}
			if (is_destroying_effect && overridden || (parent_effect.f & 16384) !== 0) return d.v;
			return get(d);
		});
	}
	if (typeof HTMLElement === "function");
	//#endregion
	//#region node_modules/svelte/src/internal/disclose-version.js
	if (typeof window !== "undefined") ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
	//#endregion
	//#region src/tile.svelte
	var root$2 = /* @__PURE__ */ from_html(`<span class="material-icons-round icon x svelte-avvm3f">close</span>`);
	var root_1$2 = /* @__PURE__ */ from_html(`<span class="material-icons-outlined icon o svelte-avvm3f">circle</span>`);
	var root_2$2 = /* @__PURE__ */ from_html(`<p> </p>`);
	var root_3$2 = /* @__PURE__ */ from_html(`<button class="tile svelte-avvm3f"><div class="con svelte-avvm3f"><!></div></button>`);
	function Tile($$anchor, $$props) {
		push($$props, true);
		let cooling = /* @__PURE__ */ state(false);
		const enabled = /* @__PURE__ */ user_derived(() => $$props.state == "" && !get(cooling));
		const vote = () => {
			set(cooling, true);
			setTimeout(() => {
				set(cooling, false);
			}, 1e3);
			$$props.onvote?.();
		};
		const share = /* @__PURE__ */ user_derived(() => $$props.total > 0 ? $$props.votes / $$props.total : 0);
		var button = root_3$2();
		var div = child(button);
		var node = child(div);
		var consequent_1 = ($$anchor) => {
			var fragment = comment();
			var node_1 = first_child(fragment);
			var consequent = ($$anchor) => {
				append($$anchor, root$2());
			};
			var alternate = ($$anchor) => {
				append($$anchor, root_1$2());
			};
			if_block(node_1, ($$render) => {
				if ($$props.state == "x") $$render(consequent);
				else $$render(alternate, -1);
			});
			append($$anchor, fragment);
		};
		var alternate_1 = ($$anchor) => {
			var p = root_2$2();
			var text = child(p, true);
			reset(p);
			template_effect(($0, $1) => {
				set_style(p, `opacity: ${$0 ?? ""}; font-size: ${$1 ?? ""}`);
				set_text(text, $$props.votes);
			}, [() => Math.max($$props.votes > 0 ? get(share) * 5 : 0, .1), () => Math.min(Math.max(1, get(share) * 3), 3.5) + "em"]);
			append($$anchor, p);
		};
		if_block(node, ($$render) => {
			if ($$props.state != "") $$render(consequent_1);
			else $$render(alternate_1, -1);
		});
		reset(div);
		reset(button);
		template_effect(($0) => {
			button.disabled = !get(enabled);
			set_style(button, `position: relative; background: rgba(0, 255, 149, ${$0 ?? ""});`);
		}, [() => ($$props.votes > 0 ? get(share) * .8 : 0).toPrecision(2)]);
		delegated("click", button, vote);
		append($$anchor, button);
		pop();
	}
	delegate(["click"]);
	//#endregion
	//#region node_modules/engine.io-parser/build/esm/commons.js
	var PACKET_TYPES = Object.create(null);
	PACKET_TYPES["open"] = "0";
	PACKET_TYPES["close"] = "1";
	PACKET_TYPES["ping"] = "2";
	PACKET_TYPES["pong"] = "3";
	PACKET_TYPES["message"] = "4";
	PACKET_TYPES["upgrade"] = "5";
	PACKET_TYPES["noop"] = "6";
	var PACKET_TYPES_REVERSE = Object.create(null);
	Object.keys(PACKET_TYPES).forEach((key) => {
		PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
	});
	var ERROR_PACKET = {
		type: "error",
		data: "parser error"
	};
	//#endregion
	//#region node_modules/engine.io-parser/build/esm/encodePacket.browser.js
	var withNativeBlob$1 = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
	var withNativeArrayBuffer$2 = typeof ArrayBuffer === "function";
	var isView$1 = (obj) => {
		return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
	};
	var encodePacket = ({ type, data }, supportsBinary, callback) => {
		if (withNativeBlob$1 && data instanceof Blob) if (supportsBinary) return callback(data);
		else return encodeBlobAsBase64(data, callback);
		else if (withNativeArrayBuffer$2 && (data instanceof ArrayBuffer || isView$1(data))) if (supportsBinary) return callback(data);
		else return encodeBlobAsBase64(new Blob([data]), callback);
		return callback(PACKET_TYPES[type] + (data || ""));
	};
	var encodeBlobAsBase64 = (data, callback) => {
		const fileReader = new FileReader();
		fileReader.onload = function() {
			const content = fileReader.result.split(",")[1];
			callback("b" + (content || ""));
		};
		return fileReader.readAsDataURL(data);
	};
	function toArray(data) {
		if (data instanceof Uint8Array) return data;
		else if (data instanceof ArrayBuffer) return new Uint8Array(data);
		else return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	}
	var TEXT_ENCODER;
	function encodePacketToBinary(packet, callback) {
		if (withNativeBlob$1 && packet.data instanceof Blob) return packet.data.arrayBuffer().then(toArray).then(callback);
		else if (withNativeArrayBuffer$2 && (packet.data instanceof ArrayBuffer || isView$1(packet.data))) return callback(toArray(packet.data));
		encodePacket(packet, false, (encoded) => {
			if (!TEXT_ENCODER) TEXT_ENCODER = new TextEncoder();
			callback(TEXT_ENCODER.encode(encoded));
		});
	}
	//#endregion
	//#region node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var lookup$1 = typeof Uint8Array === "undefined" ? [] : /* @__PURE__ */ new Uint8Array(256);
	for (let i = 0; i < 64; i++) lookup$1[chars.charCodeAt(i)] = i;
	var decode$1 = (base64) => {
		let bufferLength = base64.length * .75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
		if (base64[base64.length - 1] === "=") {
			bufferLength--;
			if (base64[base64.length - 2] === "=") bufferLength--;
		}
		const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
		for (i = 0; i < len; i += 4) {
			encoded1 = lookup$1[base64.charCodeAt(i)];
			encoded2 = lookup$1[base64.charCodeAt(i + 1)];
			encoded3 = lookup$1[base64.charCodeAt(i + 2)];
			encoded4 = lookup$1[base64.charCodeAt(i + 3)];
			bytes[p++] = encoded1 << 2 | encoded2 >> 4;
			bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
			bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
		}
		return arraybuffer;
	};
	//#endregion
	//#region node_modules/engine.io-parser/build/esm/decodePacket.browser.js
	var withNativeArrayBuffer$1 = typeof ArrayBuffer === "function";
	var decodePacket = (encodedPacket, binaryType) => {
		if (typeof encodedPacket !== "string") return {
			type: "message",
			data: mapBinary(encodedPacket, binaryType)
		};
		const type = encodedPacket.charAt(0);
		if (type === "b") return {
			type: "message",
			data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
		};
		if (!PACKET_TYPES_REVERSE[type]) return ERROR_PACKET;
		return encodedPacket.length > 1 ? {
			type: PACKET_TYPES_REVERSE[type],
			data: encodedPacket.substring(1)
		} : { type: PACKET_TYPES_REVERSE[type] };
	};
	var decodeBase64Packet = (data, binaryType) => {
		if (withNativeArrayBuffer$1) return mapBinary(decode$1(data), binaryType);
		else return {
			base64: true,
			data
		};
	};
	var mapBinary = (data, binaryType) => {
		switch (binaryType) {
			case "blob": if (data instanceof Blob) return data;
			else return new Blob([data]);
			default: if (data instanceof ArrayBuffer) return data;
			else return data.buffer;
		}
	};
	//#endregion
	//#region node_modules/engine.io-parser/build/esm/index.js
	var SEPARATOR = String.fromCharCode(30);
	var encodePayload = (packets, callback) => {
		const length = packets.length;
		const encodedPackets = new Array(length);
		let count = 0;
		packets.forEach((packet, i) => {
			encodePacket(packet, false, (encodedPacket) => {
				encodedPackets[i] = encodedPacket;
				if (++count === length) callback(encodedPackets.join(SEPARATOR));
			});
		});
	};
	var decodePayload = (encodedPayload, binaryType) => {
		const encodedPackets = encodedPayload.split(SEPARATOR);
		const packets = [];
		for (let i = 0; i < encodedPackets.length; i++) {
			const decodedPacket = decodePacket(encodedPackets[i], binaryType);
			packets.push(decodedPacket);
			if (decodedPacket.type === "error") break;
		}
		return packets;
	};
	function createPacketEncoderStream() {
		return new TransformStream({ transform(packet, controller) {
			encodePacketToBinary(packet, (encodedPacket) => {
				const payloadLength = encodedPacket.length;
				let header;
				if (payloadLength < 126) {
					header = /* @__PURE__ */ new Uint8Array(1);
					new DataView(header.buffer).setUint8(0, payloadLength);
				} else if (payloadLength < 65536) {
					header = /* @__PURE__ */ new Uint8Array(3);
					const view = new DataView(header.buffer);
					view.setUint8(0, 126);
					view.setUint16(1, payloadLength);
				} else {
					header = /* @__PURE__ */ new Uint8Array(9);
					const view = new DataView(header.buffer);
					view.setUint8(0, 127);
					view.setBigUint64(1, BigInt(payloadLength));
				}
				if (packet.data && typeof packet.data !== "string") header[0] |= 128;
				controller.enqueue(header);
				controller.enqueue(encodedPacket);
			});
		} });
	}
	var TEXT_DECODER;
	function totalLength(chunks) {
		return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
	}
	function concatChunks(chunks, size) {
		if (chunks[0].length === size) return chunks.shift();
		const buffer = new Uint8Array(size);
		let j = 0;
		for (let i = 0; i < size; i++) {
			buffer[i] = chunks[0][j++];
			if (j === chunks[0].length) {
				chunks.shift();
				j = 0;
			}
		}
		if (chunks.length && j < chunks[0].length) chunks[0] = chunks[0].slice(j);
		return buffer;
	}
	function createPacketDecoderStream(maxPayload, binaryType) {
		if (!TEXT_DECODER) TEXT_DECODER = new TextDecoder();
		const chunks = [];
		let state = 0;
		let expectedLength = -1;
		let isBinary = false;
		return new TransformStream({ transform(chunk, controller) {
			chunks.push(chunk);
			while (true) {
				if (state === 0) {
					if (totalLength(chunks) < 1) break;
					const header = concatChunks(chunks, 1);
					isBinary = (header[0] & 128) === 128;
					expectedLength = header[0] & 127;
					if (expectedLength < 126) state = 3;
					else if (expectedLength === 126) state = 1;
					else state = 2;
				} else if (state === 1) {
					if (totalLength(chunks) < 2) break;
					const headerArray = concatChunks(chunks, 2);
					expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
					state = 3;
				} else if (state === 2) {
					if (totalLength(chunks) < 8) break;
					const headerArray = concatChunks(chunks, 8);
					const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
					const n = view.getUint32(0);
					if (n > Math.pow(2, 21) - 1) {
						controller.enqueue(ERROR_PACKET);
						break;
					}
					expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
					state = 3;
				} else {
					if (totalLength(chunks) < expectedLength) break;
					const data = concatChunks(chunks, expectedLength);
					controller.enqueue(decodePacket(isBinary ? data : TEXT_DECODER.decode(data), binaryType));
					state = 0;
				}
				if (expectedLength === 0 || expectedLength > maxPayload) {
					controller.enqueue(ERROR_PACKET);
					break;
				}
			}
		} });
	}
	//#endregion
	//#region node_modules/@socket.io/component-emitter/lib/esm/index.js
	/**
	* Initialize a new `Emitter`.
	*
	* @api public
	*/
	function Emitter(obj) {
		if (obj) return mixin(obj);
	}
	/**
	* Mixin the emitter properties.
	*
	* @param {Object} obj
	* @return {Object}
	* @api private
	*/
	function mixin(obj) {
		for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
		return obj;
	}
	/**
	* Listen on the given `event` with `fn`.
	*
	* @param {String} event
	* @param {Function} fn
	* @return {Emitter}
	* @api public
	*/
	Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
		this._callbacks = this._callbacks || {};
		(this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
		return this;
	};
	/**
	* Adds an `event` listener that will be invoked a single
	* time then automatically removed.
	*
	* @param {String} event
	* @param {Function} fn
	* @return {Emitter}
	* @api public
	*/
	Emitter.prototype.once = function(event, fn) {
		function on() {
			this.off(event, on);
			fn.apply(this, arguments);
		}
		on.fn = fn;
		this.on(event, on);
		return this;
	};
	/**
	* Remove the given callback for `event` or all
	* registered callbacks.
	*
	* @param {String} event
	* @param {Function} fn
	* @return {Emitter}
	* @api public
	*/
	Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
		this._callbacks = this._callbacks || {};
		if (0 == arguments.length) {
			this._callbacks = {};
			return this;
		}
		var callbacks = this._callbacks["$" + event];
		if (!callbacks) return this;
		if (1 == arguments.length) {
			delete this._callbacks["$" + event];
			return this;
		}
		var cb;
		for (var i = 0; i < callbacks.length; i++) {
			cb = callbacks[i];
			if (cb === fn || cb.fn === fn) {
				callbacks.splice(i, 1);
				break;
			}
		}
		if (callbacks.length === 0) delete this._callbacks["$" + event];
		return this;
	};
	/**
	* Emit `event` with the given args.
	*
	* @param {String} event
	* @param {Mixed} ...
	* @return {Emitter}
	*/
	Emitter.prototype.emit = function(event) {
		this._callbacks = this._callbacks || {};
		var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
		for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
		if (callbacks) {
			callbacks = callbacks.slice(0);
			for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
		}
		return this;
	};
	Emitter.prototype.emitReserved = Emitter.prototype.emit;
	/**
	* Return array of callbacks for `event`.
	*
	* @param {String} event
	* @return {Array}
	* @api public
	*/
	Emitter.prototype.listeners = function(event) {
		this._callbacks = this._callbacks || {};
		return this._callbacks["$" + event] || [];
	};
	/**
	* Check if this emitter has `event` handlers.
	*
	* @param {String} event
	* @return {Boolean}
	* @api public
	*/
	Emitter.prototype.hasListeners = function(event) {
		return !!this.listeners(event).length;
	};
	//#endregion
	//#region node_modules/engine.io-client/build/esm/globals.js
	var nextTick = (() => {
		if (typeof Promise === "function" && typeof Promise.resolve === "function") return (cb) => Promise.resolve().then(cb);
		else return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
	})();
	var globalThisShim = (() => {
		if (typeof self !== "undefined") return self;
		else if (typeof window !== "undefined") return window;
		else return Function("return this")();
	})();
	var defaultBinaryType = "arraybuffer";
	//#endregion
	//#region node_modules/engine.io-client/build/esm/util.js
	function pick(obj, ...attr) {
		return attr.reduce((acc, k) => {
			if (obj.hasOwnProperty(k)) acc[k] = obj[k];
			return acc;
		}, {});
	}
	var NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
	var NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
	function installTimerFunctions(obj, opts) {
		if (opts.useNativeTimers) {
			obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
			obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
		} else {
			obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
			obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
		}
	}
	var BASE64_OVERHEAD = 1.33;
	function byteLength(obj) {
		if (typeof obj === "string") return utf8Length(obj);
		return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
	}
	function utf8Length(str) {
		let c = 0, length = 0;
		for (let i = 0, l = str.length; i < l; i++) {
			c = str.charCodeAt(i);
			if (c < 128) length += 1;
			else if (c < 2048) length += 2;
			else if (c < 55296 || c >= 57344) length += 3;
			else {
				i++;
				length += 4;
			}
		}
		return length;
	}
	/**
	* Generates a random 8-characters string.
	*/
	function randomString() {
		return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
	}
	//#endregion
	//#region node_modules/engine.io-client/build/esm/contrib/parseqs.js
	/**
	* Compiles a querystring
	* Returns string representation of the object
	*
	* @param {Object}
	* @api private
	*/
	function encode(obj) {
		let str = "";
		for (let i in obj) if (obj.hasOwnProperty(i)) {
			if (str.length) str += "&";
			str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
		}
		return str;
	}
	/**
	* Parses a simple querystring into an object
	*
	* @param {String} qs
	* @api private
	*/
	function decode(qs) {
		let qry = {};
		let pairs = qs.split("&");
		for (let i = 0, l = pairs.length; i < l; i++) {
			let pair = pairs[i].split("=");
			qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}
		return qry;
	}
	//#endregion
	//#region node_modules/engine.io-client/build/esm/transport.js
	var TransportError = class extends Error {
		constructor(reason, description, context) {
			super(reason);
			this.description = description;
			this.context = context;
			this.type = "TransportError";
		}
	};
	var Transport = class extends Emitter {
		/**
		* Transport abstract constructor.
		*
		* @param {Object} opts - options
		* @protected
		*/
		constructor(opts) {
			super();
			this.writable = false;
			installTimerFunctions(this, opts);
			this.opts = opts;
			this.query = opts.query;
			this.socket = opts.socket;
			this.supportsBinary = !opts.forceBase64;
		}
		/**
		* Emits an error.
		*
		* @param {String} reason
		* @param description
		* @param context - the error context
		* @return {Transport} for chaining
		* @protected
		*/
		onError(reason, description, context) {
			super.emitReserved("error", new TransportError(reason, description, context));
			return this;
		}
		/**
		* Opens the transport.
		*/
		open() {
			this.readyState = "opening";
			this.doOpen();
			return this;
		}
		/**
		* Closes the transport.
		*/
		close() {
			if (this.readyState === "opening" || this.readyState === "open") {
				this.doClose();
				this.onClose();
			}
			return this;
		}
		/**
		* Sends multiple packets.
		*
		* @param {Array} packets
		*/
		send(packets) {
			if (this.readyState === "open") this.write(packets);
		}
		/**
		* Called upon open
		*
		* @protected
		*/
		onOpen() {
			this.readyState = "open";
			this.writable = true;
			super.emitReserved("open");
		}
		/**
		* Called with data.
		*
		* @param {String} data
		* @protected
		*/
		onData(data) {
			const packet = decodePacket(data, this.socket.binaryType);
			this.onPacket(packet);
		}
		/**
		* Called with a decoded packet.
		*
		* @protected
		*/
		onPacket(packet) {
			super.emitReserved("packet", packet);
		}
		/**
		* Called upon close.
		*
		* @protected
		*/
		onClose(details) {
			this.readyState = "closed";
			super.emitReserved("close", details);
		}
		/**
		* Pauses the transport, in order not to lose packets during an upgrade.
		*
		* @param onPause
		*/
		pause(onPause) {}
		createUri(schema, query = {}) {
			return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
		}
		_hostname() {
			const hostname = this.opts.hostname;
			return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
		}
		_port() {
			if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) return ":" + this.opts.port;
			else return "";
		}
		_query(query) {
			const encodedQuery = encode(query);
			return encodedQuery.length ? "?" + encodedQuery : "";
		}
	};
	//#endregion
	//#region node_modules/engine.io-client/build/esm/transports/polling.js
	var Polling = class extends Transport {
		constructor() {
			super(...arguments);
			this._polling = false;
		}
		get name() {
			return "polling";
		}
		/**
		* Opens the socket (triggers polling). We write a PING message to determine
		* when the transport is open.
		*
		* @protected
		*/
		doOpen() {
			this._poll();
		}
		/**
		* Pauses polling.
		*
		* @param {Function} onPause - callback upon buffers are flushed and transport is paused
		* @package
		*/
		pause(onPause) {
			this.readyState = "pausing";
			const pause = () => {
				this.readyState = "paused";
				onPause();
			};
			if (this._polling || !this.writable) {
				let total = 0;
				if (this._polling) {
					total++;
					this.once("pollComplete", function() {
						--total || pause();
					});
				}
				if (!this.writable) {
					total++;
					this.once("drain", function() {
						--total || pause();
					});
				}
			} else pause();
		}
		/**
		* Starts polling cycle.
		*
		* @private
		*/
		_poll() {
			this._polling = true;
			this.doPoll();
			this.emitReserved("poll");
		}
		/**
		* Overloads onData to detect payloads.
		*
		* @protected
		*/
		onData(data) {
			const callback = (packet) => {
				if ("opening" === this.readyState && packet.type === "open") this.onOpen();
				if ("close" === packet.type) {
					this.onClose({ description: "transport closed by the server" });
					return false;
				}
				this.onPacket(packet);
			};
			decodePayload(data, this.socket.binaryType).forEach(callback);
			if ("closed" !== this.readyState) {
				this._polling = false;
				this.emitReserved("pollComplete");
				if ("open" === this.readyState) this._poll();
			}
		}
		/**
		* For polling, send a close packet.
		*
		* @protected
		*/
		doClose() {
			const close = () => {
				this.write([{ type: "close" }]);
			};
			if ("open" === this.readyState) close();
			else this.once("open", close);
		}
		/**
		* Writes a packets payload.
		*
		* @param {Array} packets - data packets
		* @protected
		*/
		write(packets) {
			this.writable = false;
			encodePayload(packets, (data) => {
				this.doWrite(data, () => {
					this.writable = true;
					this.emitReserved("drain");
				});
			});
		}
		/**
		* Generates uri for connection.
		*
		* @private
		*/
		uri() {
			const schema = this.opts.secure ? "https" : "http";
			const query = this.query || {};
			if (false !== this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
			if (!this.supportsBinary && !query.sid) query.b64 = 1;
			return this.createUri(schema, query);
		}
	};
	//#endregion
	//#region node_modules/engine.io-client/build/esm/contrib/has-cors.js
	var value = false;
	try {
		value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
	} catch (err) {}
	var hasCORS = value;
	//#endregion
	//#region node_modules/engine.io-client/build/esm/transports/polling-xhr.js
	function empty() {}
	var BaseXHR = class extends Polling {
		/**
		* XHR Polling constructor.
		*
		* @param {Object} opts
		* @package
		*/
		constructor(opts) {
			super(opts);
			if (typeof location !== "undefined") {
				const isSSL = "https:" === location.protocol;
				let port = location.port;
				if (!port) port = isSSL ? "443" : "80";
				this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
			}
		}
		/**
		* Sends data.
		*
		* @param {String} data - data to send.
		* @param {Function} fn - called upon flush.
		* @private
		*/
		doWrite(data, fn) {
			const req = this.request({
				method: "POST",
				data
			});
			req.on("success", fn);
			req.on("error", (xhrStatus, context) => {
				this.onError("xhr post error", xhrStatus, context);
			});
		}
		/**
		* Starts a poll cycle.
		*
		* @private
		*/
		doPoll() {
			const req = this.request();
			req.on("data", this.onData.bind(this));
			req.on("error", (xhrStatus, context) => {
				this.onError("xhr poll error", xhrStatus, context);
			});
			this.pollXhr = req;
		}
	};
	var Request = class Request extends Emitter {
		/**
		* Request constructor
		*
		* @param {Object} options
		* @package
		*/
		constructor(createRequest, uri, opts) {
			super();
			this.createRequest = createRequest;
			installTimerFunctions(this, opts);
			this._opts = opts;
			this._method = opts.method || "GET";
			this._uri = uri;
			this._data = void 0 !== opts.data ? opts.data : null;
			this._create();
		}
		/**
		* Creates the XHR object and sends the request.
		*
		* @private
		*/
		_create() {
			var _a;
			const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
			opts.xdomain = !!this._opts.xd;
			const xhr = this._xhr = this.createRequest(opts);
			try {
				xhr.open(this._method, this._uri, true);
				try {
					if (this._opts.extraHeaders) {
						xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
						for (let i in this._opts.extraHeaders) if (this._opts.extraHeaders.hasOwnProperty(i)) xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
					}
				} catch (e) {}
				if ("POST" === this._method) try {
					xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
				} catch (e) {}
				try {
					xhr.setRequestHeader("Accept", "*/*");
				} catch (e) {}
				(_a = this._opts.cookieJar) === null || _a === void 0 || _a.addCookies(xhr);
				if ("withCredentials" in xhr) xhr.withCredentials = this._opts.withCredentials;
				if (this._opts.requestTimeout) xhr.timeout = this._opts.requestTimeout;
				xhr.onreadystatechange = () => {
					var _a;
					if (xhr.readyState === 3) (_a = this._opts.cookieJar) === null || _a === void 0 || _a.parseCookies(xhr.getResponseHeader("set-cookie"));
					if (4 !== xhr.readyState) return;
					if (200 === xhr.status || 1223 === xhr.status) this._onLoad();
					else this.setTimeoutFn(() => {
						this._onError(typeof xhr.status === "number" ? xhr.status : 0);
					}, 0);
				};
				xhr.send(this._data);
			} catch (e) {
				this.setTimeoutFn(() => {
					this._onError(e);
				}, 0);
				return;
			}
			if (typeof document !== "undefined") {
				this._index = Request.requestsCount++;
				Request.requests[this._index] = this;
			}
		}
		/**
		* Called upon error.
		*
		* @private
		*/
		_onError(err) {
			this.emitReserved("error", err, this._xhr);
			this._cleanup(true);
		}
		/**
		* Cleans up house.
		*
		* @private
		*/
		_cleanup(fromError) {
			if ("undefined" === typeof this._xhr || null === this._xhr) return;
			this._xhr.onreadystatechange = empty;
			if (fromError) try {
				this._xhr.abort();
			} catch (e) {}
			if (typeof document !== "undefined") delete Request.requests[this._index];
			this._xhr = null;
		}
		/**
		* Called upon load.
		*
		* @private
		*/
		_onLoad() {
			const data = this._xhr.responseText;
			if (data !== null) {
				this.emitReserved("data", data);
				this.emitReserved("success");
				this._cleanup();
			}
		}
		/**
		* Aborts the request.
		*
		* @package
		*/
		abort() {
			this._cleanup();
		}
	};
	Request.requestsCount = 0;
	Request.requests = {};
	/**
	* Aborts pending requests when unloading the window. This is needed to prevent
	* memory leaks (e.g. when using IE) and to ensure that no spurious error is
	* emitted.
	*/
	if (typeof document !== "undefined") {
		if (typeof attachEvent === "function") attachEvent("onunload", unloadHandler);
		else if (typeof addEventListener === "function") {
			const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
			addEventListener(terminationEvent, unloadHandler, false);
		}
	}
	function unloadHandler() {
		for (let i in Request.requests) if (Request.requests.hasOwnProperty(i)) Request.requests[i].abort();
	}
	var hasXHR2 = (function() {
		const xhr = newRequest({ xdomain: false });
		return xhr && xhr.responseType !== null;
	})();
	/**
	* HTTP long-polling based on the built-in `XMLHttpRequest` object.
	*
	* Usage: browser
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
	*/
	var XHR = class extends BaseXHR {
		constructor(opts) {
			super(opts);
			const forceBase64 = opts && opts.forceBase64;
			this.supportsBinary = hasXHR2 && !forceBase64;
		}
		request(opts = {}) {
			Object.assign(opts, { xd: this.xd }, this.opts);
			return new Request(newRequest, this.uri(), opts);
		}
	};
	function newRequest(opts) {
		const xdomain = opts.xdomain;
		try {
			if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest();
		} catch (e) {}
		if (!xdomain) try {
			return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
		} catch (e) {}
	}
	//#endregion
	//#region node_modules/engine.io-client/build/esm/transports/websocket.js
	var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
	var BaseWS = class extends Transport {
		get name() {
			return "websocket";
		}
		doOpen() {
			const uri = this.uri();
			const protocols = this.opts.protocols;
			const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
			if (this.opts.extraHeaders) opts.headers = this.opts.extraHeaders;
			try {
				this.ws = this.createSocket(uri, protocols, opts);
			} catch (err) {
				return this.emitReserved("error", err);
			}
			this.ws.binaryType = this.socket.binaryType;
			this.addEventListeners();
		}
		/**
		* Adds event listeners to the socket
		*
		* @private
		*/
		addEventListeners() {
			this.ws.onopen = () => {
				if (this.opts.autoUnref) this.ws._socket.unref();
				this.onOpen();
			};
			this.ws.onclose = (closeEvent) => this.onClose({
				description: "websocket connection closed",
				context: closeEvent
			});
			this.ws.onmessage = (ev) => this.onData(ev.data);
			this.ws.onerror = (e) => this.onError("websocket error", e);
		}
		write(packets) {
			this.writable = false;
			for (let i = 0; i < packets.length; i++) {
				const packet = packets[i];
				const lastPacket = i === packets.length - 1;
				encodePacket(packet, this.supportsBinary, (data) => {
					try {
						this.doWrite(packet, data);
					} catch (e) {}
					if (lastPacket) nextTick(() => {
						this.writable = true;
						this.emitReserved("drain");
					}, this.setTimeoutFn);
				});
			}
		}
		doClose() {
			if (typeof this.ws !== "undefined") {
				this.ws.onerror = () => {};
				this.ws.close();
				this.ws = null;
			}
		}
		/**
		* Generates uri for connection.
		*
		* @private
		*/
		uri() {
			const schema = this.opts.secure ? "wss" : "ws";
			const query = this.query || {};
			if (this.opts.timestampRequests) query[this.opts.timestampParam] = randomString();
			if (!this.supportsBinary) query.b64 = 1;
			return this.createUri(schema, query);
		}
	};
	var WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
	/**
	* WebSocket transport based on the built-in `WebSocket` object.
	*
	* Usage: browser, Node.js (since v21), Deno, Bun
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
	* @see https://caniuse.com/mdn-api_websocket
	* @see https://nodejs.org/api/globals.html#websocket
	*/
	var WS = class extends BaseWS {
		createSocket(uri, protocols, opts) {
			return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
		}
		doWrite(_packet, data) {
			this.ws.send(data);
		}
	};
	//#endregion
	//#region node_modules/engine.io-client/build/esm/transports/webtransport.js
	/**
	* WebTransport transport based on the built-in `WebTransport` object.
	*
	* Usage: browser, Node.js (with the `@fails-components/webtransport` package)
	*
	* @see https://developer.mozilla.org/en-US/docs/Web/API/WebTransport
	* @see https://caniuse.com/webtransport
	*/
	var WT = class extends Transport {
		get name() {
			return "webtransport";
		}
		doOpen() {
			try {
				this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
			} catch (err) {
				return this.emitReserved("error", err);
			}
			this._transport.closed.then(() => {
				this.onClose();
			}).catch((err) => {
				this.onError("webtransport error", err);
			});
			this._transport.ready.then(() => {
				this._transport.createBidirectionalStream().then((stream) => {
					const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
					const reader = stream.readable.pipeThrough(decoderStream).getReader();
					const encoderStream = createPacketEncoderStream();
					encoderStream.readable.pipeTo(stream.writable);
					this._writer = encoderStream.writable.getWriter();
					const read = () => {
						reader.read().then(({ done, value }) => {
							if (done) return;
							this.onPacket(value);
							read();
						}).catch((err) => {});
					};
					read();
					const packet = { type: "open" };
					if (this.query.sid) packet.data = `{"sid":"${this.query.sid}"}`;
					this._writer.write(packet).then(() => this.onOpen());
				});
			});
		}
		write(packets) {
			this.writable = false;
			for (let i = 0; i < packets.length; i++) {
				const packet = packets[i];
				const lastPacket = i === packets.length - 1;
				this._writer.write(packet).then(() => {
					if (lastPacket) nextTick(() => {
						this.writable = true;
						this.emitReserved("drain");
					}, this.setTimeoutFn);
				});
			}
		}
		doClose() {
			var _a;
			(_a = this._transport) === null || _a === void 0 || _a.close();
		}
	};
	//#endregion
	//#region node_modules/engine.io-client/build/esm/transports/index.js
	var transports = {
		websocket: WS,
		webtransport: WT,
		polling: XHR
	};
	//#endregion
	//#region node_modules/engine.io-client/build/esm/contrib/parseuri.js
	/**
	* Parses a URI
	*
	* Note: we could also have used the built-in URL object, but it isn't supported on all platforms.
	*
	* See:
	* - https://developer.mozilla.org/en-US/docs/Web/API/URL
	* - https://caniuse.com/url
	* - https://www.rfc-editor.org/rfc/rfc3986#appendix-B
	*
	* History of the parse() method:
	* - first commit: https://github.com/socketio/socket.io-client/commit/4ee1d5d94b3906a9c052b459f1a818b15f38f91c
	* - export into its own module: https://github.com/socketio/engine.io-client/commit/de2c561e4564efeb78f1bdb1ba39ef81b2822cb3
	* - reimport: https://github.com/socketio/engine.io-client/commit/df32277c3f6d622eec5ed09f493cae3f3391d242
	*
	* @author Steven Levithan <stevenlevithan.com> (MIT license)
	* @api private
	*/
	var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
	var parts = [
		"source",
		"protocol",
		"authority",
		"userInfo",
		"user",
		"password",
		"host",
		"port",
		"relative",
		"path",
		"directory",
		"file",
		"query",
		"anchor"
	];
	function parse(str) {
		if (str.length > 8e3) throw "URI too long";
		const src = str, b = str.indexOf("["), e = str.indexOf("]");
		if (b != -1 && e != -1) str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
		let m = re.exec(str || ""), uri = {}, i = 14;
		while (i--) uri[parts[i]] = m[i] || "";
		if (b != -1 && e != -1) {
			uri.source = src;
			uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
			uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
			uri.ipv6uri = true;
		}
		uri.pathNames = pathNames(uri, uri["path"]);
		uri.queryKey = queryKey(uri, uri["query"]);
		return uri;
	}
	function pathNames(obj, path) {
		const names = path.replace(/\/{2,9}/g, "/").split("/");
		if (path.slice(0, 1) == "/" || path.length === 0) names.splice(0, 1);
		if (path.slice(-1) == "/") names.splice(names.length - 1, 1);
		return names;
	}
	function queryKey(uri, query) {
		const data = {};
		query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
			if ($1) data[$1] = $2;
		});
		return data;
	}
	//#endregion
	//#region node_modules/engine.io-client/build/esm/socket.js
	var withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
	var OFFLINE_EVENT_LISTENERS = [];
	if (withEventListeners) addEventListener("offline", () => {
		OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
	}, false);
	/**
	* This class provides a WebSocket-like interface to connect to an Engine.IO server. The connection will be established
	* with one of the available low-level transports, like HTTP long-polling, WebSocket or WebTransport.
	*
	* This class comes without upgrade mechanism, which means that it will keep the first low-level transport that
	* successfully establishes the connection.
	*
	* In order to allow tree-shaking, there are no transports included, that's why the `transports` option is mandatory.
	*
	* @example
	* import { SocketWithoutUpgrade, WebSocket } from "engine.io-client";
	*
	* const socket = new SocketWithoutUpgrade({
	*   transports: [WebSocket]
	* });
	*
	* socket.on("open", () => {
	*   socket.send("hello");
	* });
	*
	* @see SocketWithUpgrade
	* @see Socket
	*/
	var SocketWithoutUpgrade = class SocketWithoutUpgrade extends Emitter {
		/**
		* Socket constructor.
		*
		* @param {String|Object} uri - uri or options
		* @param {Object} opts - options
		*/
		constructor(uri, opts) {
			super();
			this.binaryType = defaultBinaryType;
			this.writeBuffer = [];
			this._prevBufferLen = 0;
			this._pingInterval = -1;
			this._pingTimeout = -1;
			this._maxPayload = -1;
			/**
			* The expiration timestamp of the {@link _pingTimeoutTimer} object is tracked, in case the timer is throttled and the
			* callback is not fired on time. This can happen for example when a laptop is suspended or when a phone is locked.
			*/
			this._pingTimeoutTime = Infinity;
			if (uri && "object" === typeof uri) {
				opts = uri;
				uri = null;
			}
			if (uri) {
				const parsedUri = parse(uri);
				opts.hostname = parsedUri.host;
				opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
				opts.port = parsedUri.port;
				if (parsedUri.query) opts.query = parsedUri.query;
			} else if (opts.host) opts.hostname = parse(opts.host).host;
			installTimerFunctions(this, opts);
			this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
			if (opts.hostname && !opts.port) opts.port = this.secure ? "443" : "80";
			this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
			this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
			this.transports = [];
			this._transportsByName = {};
			opts.transports.forEach((t) => {
				const transportName = t.prototype.name;
				this.transports.push(transportName);
				this._transportsByName[transportName] = t;
			});
			this.opts = Object.assign({
				path: "/engine.io",
				agent: false,
				withCredentials: false,
				upgrade: true,
				timestampParam: "t",
				rememberUpgrade: false,
				addTrailingSlash: true,
				rejectUnauthorized: true,
				perMessageDeflate: { threshold: 1024 },
				transportOptions: {},
				closeOnBeforeunload: false
			}, opts);
			this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
			if (typeof this.opts.query === "string") this.opts.query = decode(this.opts.query);
			if (withEventListeners) {
				if (this.opts.closeOnBeforeunload) {
					this._beforeunloadEventListener = () => {
						if (this.transport) {
							this.transport.removeAllListeners();
							this.transport.close();
						}
					};
					addEventListener("beforeunload", this._beforeunloadEventListener, false);
				}
				if (this.hostname !== "localhost") {
					this._offlineEventListener = () => {
						this._onClose("transport close", { description: "network connection lost" });
					};
					OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
				}
			}
			if (this.opts.withCredentials) this._cookieJar = void 0;
			this._open();
		}
		/**
		* Creates transport of the given type.
		*
		* @param {String} name - transport name
		* @return {Transport}
		* @private
		*/
		createTransport(name) {
			const query = Object.assign({}, this.opts.query);
			query.EIO = 4;
			query.transport = name;
			if (this.id) query.sid = this.id;
			const opts = Object.assign({}, this.opts, {
				query,
				socket: this,
				hostname: this.hostname,
				secure: this.secure,
				port: this.port
			}, this.opts.transportOptions[name]);
			return new this._transportsByName[name](opts);
		}
		/**
		* Initializes transport to use and starts probe.
		*
		* @private
		*/
		_open() {
			if (this.transports.length === 0) {
				this.setTimeoutFn(() => {
					this.emitReserved("error", "No transports available");
				}, 0);
				return;
			}
			const transportName = this.opts.rememberUpgrade && SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
			this.readyState = "opening";
			const transport = this.createTransport(transportName);
			transport.open();
			this.setTransport(transport);
		}
		/**
		* Sets the current transport. Disables the existing one (if any).
		*
		* @private
		*/
		setTransport(transport) {
			if (this.transport) this.transport.removeAllListeners();
			this.transport = transport;
			transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
		}
		/**
		* Called when connection is deemed open.
		*
		* @private
		*/
		onOpen() {
			this.readyState = "open";
			SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
			this.emitReserved("open");
			this.flush();
		}
		/**
		* Handles a packet.
		*
		* @private
		*/
		_onPacket(packet) {
			if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
				this.emitReserved("packet", packet);
				this.emitReserved("heartbeat");
				switch (packet.type) {
					case "open":
						this.onHandshake(JSON.parse(packet.data));
						break;
					case "ping":
						this._sendPacket("pong");
						this.emitReserved("ping");
						this.emitReserved("pong");
						this._resetPingTimeout();
						break;
					case "error":
						const err = /* @__PURE__ */ new Error("server error");
						err.code = packet.data;
						this._onError(err);
						break;
					case "message":
						this.emitReserved("data", packet.data);
						this.emitReserved("message", packet.data);
						break;
				}
			}
		}
		/**
		* Called upon handshake completion.
		*
		* @param {Object} data - handshake obj
		* @private
		*/
		onHandshake(data) {
			this.emitReserved("handshake", data);
			this.id = data.sid;
			this.transport.query.sid = data.sid;
			this._pingInterval = data.pingInterval;
			this._pingTimeout = data.pingTimeout;
			this._maxPayload = data.maxPayload;
			this.onOpen();
			if ("closed" === this.readyState) return;
			this._resetPingTimeout();
		}
		/**
		* Sets and resets ping timeout timer based on server pings.
		*
		* @private
		*/
		_resetPingTimeout() {
			this.clearTimeoutFn(this._pingTimeoutTimer);
			const delay = this._pingInterval + this._pingTimeout;
			this._pingTimeoutTime = Date.now() + delay;
			this._pingTimeoutTimer = this.setTimeoutFn(() => {
				this._onClose("ping timeout");
			}, delay);
			if (this.opts.autoUnref) this._pingTimeoutTimer.unref();
		}
		/**
		* Called on `drain` event
		*
		* @private
		*/
		_onDrain() {
			this.writeBuffer.splice(0, this._prevBufferLen);
			this._prevBufferLen = 0;
			if (0 === this.writeBuffer.length) this.emitReserved("drain");
			else this.flush();
		}
		/**
		* Flush write buffers.
		*
		* @private
		*/
		flush() {
			if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
				const packets = this._getWritablePackets();
				this.transport.send(packets);
				this._prevBufferLen = packets.length;
				this.emitReserved("flush");
			}
		}
		/**
		* Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
		* long-polling)
		*
		* @private
		*/
		_getWritablePackets() {
			if (!(this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1)) return this.writeBuffer;
			let payloadSize = 1;
			for (let i = 0; i < this.writeBuffer.length; i++) {
				const data = this.writeBuffer[i].data;
				if (data) payloadSize += byteLength(data);
				if (i > 0 && payloadSize > this._maxPayload) return this.writeBuffer.slice(0, i);
				payloadSize += 2;
			}
			return this.writeBuffer;
		}
		/**
		* Checks whether the heartbeat timer has expired but the socket has not yet been notified.
		*
		* Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
		* `write()` method then the message would not be buffered by the Socket.IO client.
		*
		* @return {boolean}
		* @private
		*/
		_hasPingExpired() {
			if (!this._pingTimeoutTime) return true;
			const hasExpired = Date.now() > this._pingTimeoutTime;
			if (hasExpired) {
				this._pingTimeoutTime = 0;
				nextTick(() => {
					this._onClose("ping timeout");
				}, this.setTimeoutFn);
			}
			return hasExpired;
		}
		/**
		* Sends a message.
		*
		* @param {String} msg - message.
		* @param {Object} options.
		* @param {Function} fn - callback function.
		* @return {Socket} for chaining.
		*/
		write(msg, options, fn) {
			this._sendPacket("message", msg, options, fn);
			return this;
		}
		/**
		* Sends a message. Alias of {@link Socket#write}.
		*
		* @param {String} msg - message.
		* @param {Object} options.
		* @param {Function} fn - callback function.
		* @return {Socket} for chaining.
		*/
		send(msg, options, fn) {
			this._sendPacket("message", msg, options, fn);
			return this;
		}
		/**
		* Sends a packet.
		*
		* @param {String} type - packet type.
		* @param {String} data.
		* @param {Object} options.
		* @param {Function} fn - callback function.
		* @private
		*/
		_sendPacket(type, data, options, fn) {
			if ("function" === typeof data) {
				fn = data;
				data = void 0;
			}
			if ("function" === typeof options) {
				fn = options;
				options = null;
			}
			if ("closing" === this.readyState || "closed" === this.readyState) return;
			options = options || {};
			options.compress = false !== options.compress;
			const packet = {
				type,
				data,
				options
			};
			this.emitReserved("packetCreate", packet);
			this.writeBuffer.push(packet);
			if (fn) this.once("flush", fn);
			this.flush();
		}
		/**
		* Closes the connection.
		*/
		close() {
			const close = () => {
				this._onClose("forced close");
				this.transport.close();
			};
			const cleanupAndClose = () => {
				this.off("upgrade", cleanupAndClose);
				this.off("upgradeError", cleanupAndClose);
				close();
			};
			const waitForUpgrade = () => {
				this.once("upgrade", cleanupAndClose);
				this.once("upgradeError", cleanupAndClose);
			};
			if ("opening" === this.readyState || "open" === this.readyState) {
				this.readyState = "closing";
				if (this.writeBuffer.length) this.once("drain", () => {
					if (this.upgrading) waitForUpgrade();
					else close();
				});
				else if (this.upgrading) waitForUpgrade();
				else close();
			}
			return this;
		}
		/**
		* Called upon transport error
		*
		* @private
		*/
		_onError(err) {
			SocketWithoutUpgrade.priorWebsocketSuccess = false;
			if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
				this.transports.shift();
				return this._open();
			}
			this.emitReserved("error", err);
			this._onClose("transport error", err);
		}
		/**
		* Called upon transport close.
		*
		* @private
		*/
		_onClose(reason, description) {
			if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
				this.clearTimeoutFn(this._pingTimeoutTimer);
				this.transport.removeAllListeners("close");
				this.transport.close();
				this.transport.removeAllListeners();
				if (withEventListeners) {
					if (this._beforeunloadEventListener) removeEventListener("beforeunload", this._beforeunloadEventListener, false);
					if (this._offlineEventListener) {
						const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
						if (i !== -1) OFFLINE_EVENT_LISTENERS.splice(i, 1);
					}
				}
				this.readyState = "closed";
				this.id = null;
				this.emitReserved("close", reason, description);
				this.writeBuffer = [];
				this._prevBufferLen = 0;
			}
		}
	};
	SocketWithoutUpgrade.protocol = 4;
	/**
	* This class provides a WebSocket-like interface to connect to an Engine.IO server. The connection will be established
	* with one of the available low-level transports, like HTTP long-polling, WebSocket or WebTransport.
	*
	* This class comes with an upgrade mechanism, which means that once the connection is established with the first
	* low-level transport, it will try to upgrade to a better transport.
	*
	* In order to allow tree-shaking, there are no transports included, that's why the `transports` option is mandatory.
	*
	* @example
	* import { SocketWithUpgrade, WebSocket } from "engine.io-client";
	*
	* const socket = new SocketWithUpgrade({
	*   transports: [WebSocket]
	* });
	*
	* socket.on("open", () => {
	*   socket.send("hello");
	* });
	*
	* @see SocketWithoutUpgrade
	* @see Socket
	*/
	var SocketWithUpgrade = class extends SocketWithoutUpgrade {
		constructor() {
			super(...arguments);
			this._upgrades = [];
		}
		onOpen() {
			super.onOpen();
			if ("open" === this.readyState && this.opts.upgrade) for (let i = 0; i < this._upgrades.length; i++) this._probe(this._upgrades[i]);
		}
		/**
		* Probes a transport.
		*
		* @param {String} name - transport name
		* @private
		*/
		_probe(name) {
			let transport = this.createTransport(name);
			let failed = false;
			SocketWithoutUpgrade.priorWebsocketSuccess = false;
			const onTransportOpen = () => {
				if (failed) return;
				transport.send([{
					type: "ping",
					data: "probe"
				}]);
				transport.once("packet", (msg) => {
					if (failed) return;
					if ("pong" === msg.type && "probe" === msg.data) {
						this.upgrading = true;
						this.emitReserved("upgrading", transport);
						if (!transport) return;
						SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
						this.transport.pause(() => {
							if (failed) return;
							if ("closed" === this.readyState) return;
							cleanup();
							this.setTransport(transport);
							transport.send([{ type: "upgrade" }]);
							this.emitReserved("upgrade", transport);
							transport = null;
							this.upgrading = false;
							this.flush();
						});
					} else {
						const err = /* @__PURE__ */ new Error("probe error");
						err.transport = transport.name;
						this.emitReserved("upgradeError", err);
					}
				});
			};
			function freezeTransport() {
				if (failed) return;
				failed = true;
				cleanup();
				transport.close();
				transport = null;
			}
			const onerror = (err) => {
				const error = /* @__PURE__ */ new Error("probe error: " + err);
				error.transport = transport.name;
				freezeTransport();
				this.emitReserved("upgradeError", error);
			};
			function onTransportClose() {
				onerror("transport closed");
			}
			function onclose() {
				onerror("socket closed");
			}
			function onupgrade(to) {
				if (transport && to.name !== transport.name) freezeTransport();
			}
			const cleanup = () => {
				transport.removeListener("open", onTransportOpen);
				transport.removeListener("error", onerror);
				transport.removeListener("close", onTransportClose);
				this.off("close", onclose);
				this.off("upgrading", onupgrade);
			};
			transport.once("open", onTransportOpen);
			transport.once("error", onerror);
			transport.once("close", onTransportClose);
			this.once("close", onclose);
			this.once("upgrading", onupgrade);
			if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") this.setTimeoutFn(() => {
				if (!failed) transport.open();
			}, 200);
			else transport.open();
		}
		onHandshake(data) {
			this._upgrades = this._filterUpgrades(data.upgrades);
			super.onHandshake(data);
		}
		/**
		* Filters upgrades, returning only those matching client transports.
		*
		* @param {Array} upgrades - server upgrades
		* @private
		*/
		_filterUpgrades(upgrades) {
			const filteredUpgrades = [];
			for (let i = 0; i < upgrades.length; i++) if (~this.transports.indexOf(upgrades[i])) filteredUpgrades.push(upgrades[i]);
			return filteredUpgrades;
		}
	};
	/**
	* This class provides a WebSocket-like interface to connect to an Engine.IO server. The connection will be established
	* with one of the available low-level transports, like HTTP long-polling, WebSocket or WebTransport.
	*
	* This class comes with an upgrade mechanism, which means that once the connection is established with the first
	* low-level transport, it will try to upgrade to a better transport.
	*
	* @example
	* import { Socket } from "engine.io-client";
	*
	* const socket = new Socket();
	*
	* socket.on("open", () => {
	*   socket.send("hello");
	* });
	*
	* @see SocketWithoutUpgrade
	* @see SocketWithUpgrade
	*/
	var Socket$1 = class extends SocketWithUpgrade {
		constructor(uri, opts = {}) {
			const isOptionsOnly = typeof uri === "object";
			const o = isOptionsOnly ? { ...uri } : { ...opts };
			if (!o.transports || o.transports && typeof o.transports[0] === "string") o.transports = (o.transports || [
				"polling",
				"websocket",
				"webtransport"
			]).map((transportName) => transports[transportName]).filter((t) => !!t);
			super(isOptionsOnly ? o : uri, o);
		}
	};
	Socket$1.protocol;
	//#endregion
	//#region node_modules/socket.io-client/build/esm/url.js
	/**
	* URL parser.
	*
	* @param uri - url
	* @param path - the request path of the connection
	* @param loc - An object meant to mimic window.location.
	*        Defaults to window.location.
	* @public
	*/
	function url(uri, path = "", loc) {
		let obj = uri;
		loc = loc || typeof location !== "undefined" && location;
		if (null == uri) uri = loc.protocol + "//" + loc.host;
		if (typeof uri === "string") {
			if ("/" === uri.charAt(0)) if ("/" === uri.charAt(1)) uri = loc.protocol + uri;
			else uri = loc.host + uri;
			if (!/^(https?|wss?):\/\//.test(uri)) if ("undefined" !== typeof loc) uri = loc.protocol + "//" + uri;
			else uri = "https://" + uri;
			obj = parse(uri);
		}
		if (!obj.port) {
			if (/^(http|ws)$/.test(obj.protocol)) obj.port = "80";
			else if (/^(http|ws)s$/.test(obj.protocol)) obj.port = "443";
		}
		obj.path = obj.path || "/";
		const host = obj.host.indexOf(":") !== -1 ? "[" + obj.host + "]" : obj.host;
		obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
		obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
		return obj;
	}
	//#endregion
	//#region node_modules/socket.io-parser/build/esm/is-binary.js
	var withNativeArrayBuffer = typeof ArrayBuffer === "function";
	var isView = (obj) => {
		return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
	};
	var toString = Object.prototype.toString;
	var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
	var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
	/**
	* Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
	*
	* @private
	*/
	function isBinary(obj) {
		return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
	}
	function hasBinary(obj, toJSON) {
		if (!obj || typeof obj !== "object") return false;
		if (Array.isArray(obj)) {
			for (let i = 0, l = obj.length; i < l; i++) if (hasBinary(obj[i])) return true;
			return false;
		}
		if (isBinary(obj)) return true;
		if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) return hasBinary(obj.toJSON(), true);
		for (const key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) return true;
		return false;
	}
	//#endregion
	//#region node_modules/socket.io-parser/build/esm/binary.js
	/**
	* Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
	*
	* @param {Object} packet - socket.io event packet
	* @return {Object} with deconstructed packet and list of buffers
	* @public
	*/
	function deconstructPacket(packet) {
		const buffers = [];
		const packetData = packet.data;
		const pack = packet;
		pack.data = _deconstructPacket(packetData, buffers);
		pack.attachments = buffers.length;
		return {
			packet: pack,
			buffers
		};
	}
	function _deconstructPacket(data, buffers, toJSON) {
		if (!data) return data;
		if (isBinary(data)) {
			const placeholder = {
				_placeholder: true,
				num: buffers.length
			};
			buffers.push(data);
			return placeholder;
		} else if (Array.isArray(data)) {
			const newData = new Array(data.length);
			for (let i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i], buffers);
			return newData;
		} else if (typeof data === "object" && !(data instanceof Date)) {
			if (data.toJSON && typeof data.toJSON === "function" && !toJSON) return _deconstructPacket(data.toJSON(), buffers, true);
			const newData = {};
			for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) newData[key] = _deconstructPacket(data[key], buffers);
			return newData;
		}
		return data;
	}
	/**
	* Reconstructs a binary packet from its placeholder packet and buffers
	*
	* @param {Object} packet - event packet with placeholders
	* @param {Array} buffers - binary buffers to put in placeholder positions
	* @return {Object} reconstructed packet
	* @public
	*/
	function reconstructPacket(packet, buffers) {
		packet.data = _reconstructPacket(packet.data, buffers);
		delete packet.attachments;
		return packet;
	}
	function _reconstructPacket(data, buffers) {
		if (!data) return data;
		if (data && data._placeholder === true) if (typeof data.num === "number" && data.num >= 0 && data.num < buffers.length) return buffers[data.num];
		else throw new Error("illegal attachments");
		else if (Array.isArray(data)) for (let i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i], buffers);
		else if (typeof data === "object") {
			for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) data[key] = _reconstructPacket(data[key], buffers);
		}
		return data;
	}
	//#endregion
	//#region node_modules/socket.io-parser/build/esm/index.js
	var esm_exports = /* @__PURE__ */ __exportAll({
		Decoder: () => Decoder,
		Encoder: () => Encoder,
		PacketType: () => PacketType,
		isPacketValid: () => isPacketValid,
		protocol: () => 5
	});
	/**
	* These strings must not be used as event names, as they have a special meaning.
	*/
	var RESERVED_EVENTS$1 = [
		"connect",
		"connect_error",
		"disconnect",
		"disconnecting",
		"newListener",
		"removeListener"
	];
	var PacketType;
	(function(PacketType) {
		PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
		PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
		PacketType[PacketType["EVENT"] = 2] = "EVENT";
		PacketType[PacketType["ACK"] = 3] = "ACK";
		PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
		PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
		PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
	})(PacketType || (PacketType = {}));
	/**
	* A socket.io Encoder instance
	*/
	var Encoder = class {
		/**
		* Encoder constructor
		*
		* @param {function} replacer - custom replacer to pass down to JSON.parse
		*/
		constructor(replacer) {
			this.replacer = replacer;
		}
		/**
		* Encode a packet as a single string if non-binary, or as a
		* buffer sequence, depending on packet type.
		*
		* @param {Object} obj - packet object
		*/
		encode(obj) {
			if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
				if (hasBinary(obj)) return this.encodeAsBinary({
					type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
					nsp: obj.nsp,
					data: obj.data,
					id: obj.id
				});
			}
			return [this.encodeAsString(obj)];
		}
		/**
		* Encode packet as string.
		*/
		encodeAsString(obj) {
			let str = "" + obj.type;
			if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) str += obj.attachments + "-";
			if (obj.nsp && "/" !== obj.nsp) str += obj.nsp + ",";
			if (null != obj.id) str += obj.id;
			if (null != obj.data) str += JSON.stringify(obj.data, this.replacer);
			return str;
		}
		/**
		* Encode packet as 'buffer sequence' by removing blobs, and
		* deconstructing packet into object with placeholders and
		* a list of buffers.
		*/
		encodeAsBinary(obj) {
			const deconstruction = deconstructPacket(obj);
			const pack = this.encodeAsString(deconstruction.packet);
			const buffers = deconstruction.buffers;
			buffers.unshift(pack);
			return buffers;
		}
	};
	/**
	* A socket.io Decoder instance
	*
	* @return {Object} decoder
	*/
	var Decoder = class Decoder extends Emitter {
		/**
		* Decoder constructor
		*/
		constructor(opts) {
			super();
			this.opts = Object.assign({
				reviver: void 0,
				maxAttachments: 10
			}, typeof opts === "function" ? { reviver: opts } : opts);
		}
		/**
		* Decodes an encoded packet string into packet JSON.
		*
		* @param {String} obj - encoded packet
		*/
		add(obj) {
			let packet;
			if (typeof obj === "string") {
				if (this.reconstructor) throw new Error("got plaintext data when reconstructing a packet");
				packet = this.decodeString(obj);
				const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
				if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
					packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
					this.reconstructor = new BinaryReconstructor(packet);
				} else super.emitReserved("decoded", packet);
			} else if (isBinary(obj) || obj.base64) if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
			else {
				packet = this.reconstructor.takeBinaryData(obj);
				if (packet) {
					this.reconstructor = null;
					super.emitReserved("decoded", packet);
				}
			}
			else throw new Error("Unknown type: " + obj);
		}
		/**
		* Decode a packet String (JSON data)
		*
		* @param {String} str
		* @return {Object} packet
		*/
		decodeString(str) {
			let i = 0;
			const p = { type: Number(str.charAt(0)) };
			if (PacketType[p.type] === void 0) throw new Error("unknown packet type " + p.type);
			if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
				const start = i + 1;
				while (str.charAt(++i) !== "-" && i != str.length);
				const buf = str.substring(start, i);
				if (buf != Number(buf) || str.charAt(i) !== "-") throw new Error("Illegal attachments");
				const n = Number(buf);
				if (!isInteger(n) || n < 1) throw new Error("Illegal attachments");
				else if (n > this.opts.maxAttachments) throw new Error("too many attachments");
				p.attachments = n;
			}
			if ("/" === str.charAt(i + 1)) {
				const start = i + 1;
				while (++i) {
					if ("," === str.charAt(i)) break;
					if (i === str.length) break;
				}
				p.nsp = str.substring(start, i);
			} else p.nsp = "/";
			const next = str.charAt(i + 1);
			if ("" !== next && Number(next) == next) {
				const start = i + 1;
				while (++i) {
					const c = str.charAt(i);
					if (null == c || Number(c) != c) {
						--i;
						break;
					}
					if (i === str.length) break;
				}
				p.id = Number(str.substring(start, i + 1));
			}
			if (str.charAt(++i)) {
				const payload = this.tryParse(str.substr(i));
				if (Decoder.isPayloadValid(p.type, payload)) p.data = payload;
				else throw new Error("invalid payload");
			}
			return p;
		}
		tryParse(str) {
			try {
				return JSON.parse(str, this.opts.reviver);
			} catch (e) {
				return false;
			}
		}
		static isPayloadValid(type, payload) {
			switch (type) {
				case PacketType.CONNECT: return isObject(payload);
				case PacketType.DISCONNECT: return payload === void 0;
				case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject(payload);
				case PacketType.EVENT:
				case PacketType.BINARY_EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
				case PacketType.ACK:
				case PacketType.BINARY_ACK: return Array.isArray(payload);
			}
		}
		/**
		* Deallocates a parser's resources
		*/
		destroy() {
			if (this.reconstructor) {
				this.reconstructor.finishedReconstruction();
				this.reconstructor = null;
			}
		}
	};
	/**
	* A manager of a binary event's 'buffer sequence'. Should
	* be constructed whenever a packet of type BINARY_EVENT is
	* decoded.
	*
	* @param {Object} packet
	* @return {BinaryReconstructor} initialized reconstructor
	*/
	var BinaryReconstructor = class {
		constructor(packet) {
			this.packet = packet;
			this.buffers = [];
			this.reconPack = packet;
		}
		/**
		* Method to be called when binary data received from connection
		* after a BINARY_EVENT packet.
		*
		* @param {Buffer | ArrayBuffer} binData - the raw binary data received
		* @return {null | Object} returns null if more binary data is expected or
		*   a reconstructed packet object if all buffers have been received.
		*/
		takeBinaryData(binData) {
			this.buffers.push(binData);
			if (this.buffers.length === this.reconPack.attachments) {
				const packet = reconstructPacket(this.reconPack, this.buffers);
				this.finishedReconstruction();
				return packet;
			}
			return null;
		}
		/**
		* Cleans up binary packet reconstruction variables.
		*/
		finishedReconstruction() {
			this.reconPack = null;
			this.buffers = [];
		}
	};
	function isNamespaceValid(nsp) {
		return typeof nsp === "string";
	}
	var isInteger = Number.isInteger || function(value) {
		return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
	};
	function isAckIdValid(id) {
		return id === void 0 || isInteger(id);
	}
	function isObject(value) {
		return Object.prototype.toString.call(value) === "[object Object]";
	}
	function isDataValid(type, payload) {
		switch (type) {
			case PacketType.CONNECT: return payload === void 0 || isObject(payload);
			case PacketType.DISCONNECT: return payload === void 0;
			case PacketType.EVENT: return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS$1.indexOf(payload[0]) === -1);
			case PacketType.ACK: return Array.isArray(payload);
			case PacketType.CONNECT_ERROR: return typeof payload === "string" || isObject(payload);
			default: return false;
		}
	}
	function isPacketValid(packet) {
		return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
	}
	//#endregion
	//#region node_modules/socket.io-client/build/esm/on.js
	function on(obj, ev, fn) {
		obj.on(ev, fn);
		return function subDestroy() {
			obj.off(ev, fn);
		};
	}
	//#endregion
	//#region node_modules/socket.io-client/build/esm/socket.js
	/**
	* Internal events.
	* These events can't be emitted by the user.
	*/
	var RESERVED_EVENTS = Object.freeze({
		connect: 1,
		connect_error: 1,
		disconnect: 1,
		disconnecting: 1,
		newListener: 1,
		removeListener: 1
	});
	/**
	* A Socket is the fundamental class for interacting with the server.
	*
	* A Socket belongs to a certain Namespace (by default /) and uses an underlying {@link Manager} to communicate.
	*
	* @example
	* const socket = io();
	*
	* socket.on("connect", () => {
	*   console.log("connected");
	* });
	*
	* // send an event to the server
	* socket.emit("foo", "bar");
	*
	* socket.on("foobar", () => {
	*   // an event was received from the server
	* });
	*
	* // upon disconnection
	* socket.on("disconnect", (reason) => {
	*   console.log(`disconnected due to ${reason}`);
	* });
	*/
	var Socket = class extends Emitter {
		/**
		* `Socket` constructor.
		*/
		constructor(io, nsp, opts) {
			super();
			/**
			* Whether the socket is currently connected to the server.
			*
			* @example
			* const socket = io();
			*
			* socket.on("connect", () => {
			*   console.log(socket.connected); // true
			* });
			*
			* socket.on("disconnect", () => {
			*   console.log(socket.connected); // false
			* });
			*/
			this.connected = false;
			/**
			* Whether the connection state was recovered after a temporary disconnection. In that case, any missed packets will
			* be transmitted by the server.
			*/
			this.recovered = false;
			/**
			* Buffer for packets received before the CONNECT packet
			*/
			this.receiveBuffer = [];
			/**
			* Buffer for packets that will be sent once the socket is connected
			*/
			this.sendBuffer = [];
			/**
			* The queue of packets to be sent with retry in case of failure.
			*
			* Packets are sent one by one, each waiting for the server acknowledgement, in order to guarantee the delivery order.
			* @private
			*/
			this._queue = [];
			/**
			* A sequence to generate the ID of the {@link QueuedPacket}.
			* @private
			*/
			this._queueSeq = 0;
			this.ids = 0;
			/**
			* A map containing acknowledgement handlers.
			*
			* The `withError` attribute is used to differentiate handlers that accept an error as first argument:
			*
			* - `socket.emit("test", (err, value) => { ... })` with `ackTimeout` option
			* - `socket.timeout(5000).emit("test", (err, value) => { ... })`
			* - `const value = await socket.emitWithAck("test")`
			*
			* From those that don't:
			*
			* - `socket.emit("test", (value) => { ... });`
			*
			* In the first case, the handlers will be called with an error when:
			*
			* - the timeout is reached
			* - the socket gets disconnected
			*
			* In the second case, the handlers will be simply discarded upon disconnection, since the client will never receive
			* an acknowledgement from the server.
			*
			* @private
			*/
			this.acks = {};
			this.flags = {};
			this.io = io;
			this.nsp = nsp;
			if (opts && opts.auth) this.auth = opts.auth;
			this._opts = Object.assign({}, opts);
			if (this.io._autoConnect) this.open();
		}
		/**
		* Whether the socket is currently disconnected
		*
		* @example
		* const socket = io();
		*
		* socket.on("connect", () => {
		*   console.log(socket.disconnected); // false
		* });
		*
		* socket.on("disconnect", () => {
		*   console.log(socket.disconnected); // true
		* });
		*/
		get disconnected() {
			return !this.connected;
		}
		/**
		* Subscribe to open, close and packet events
		*
		* @private
		*/
		subEvents() {
			if (this.subs) return;
			const io = this.io;
			this.subs = [
				on(io, "open", this.onopen.bind(this)),
				on(io, "packet", this.onpacket.bind(this)),
				on(io, "error", this.onerror.bind(this)),
				on(io, "close", this.onclose.bind(this))
			];
		}
		/**
		* Whether the Socket will try to reconnect when its Manager connects or reconnects.
		*
		* @example
		* const socket = io();
		*
		* console.log(socket.active); // true
		*
		* socket.on("disconnect", (reason) => {
		*   if (reason === "io server disconnect") {
		*     // the disconnection was initiated by the server, you need to manually reconnect
		*     console.log(socket.active); // false
		*   }
		*   // else the socket will automatically try to reconnect
		*   console.log(socket.active); // true
		* });
		*/
		get active() {
			return !!this.subs;
		}
		/**
		* "Opens" the socket.
		*
		* @example
		* const socket = io({
		*   autoConnect: false
		* });
		*
		* socket.connect();
		*/
		connect() {
			if (this.connected) return this;
			this.subEvents();
			if (!this.io["_reconnecting"]) this.io.open();
			if ("open" === this.io._readyState) this.onopen();
			return this;
		}
		/**
		* Alias for {@link connect()}.
		*/
		open() {
			return this.connect();
		}
		/**
		* Sends a `message` event.
		*
		* This method mimics the WebSocket.send() method.
		*
		* @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
		*
		* @example
		* socket.send("hello");
		*
		* // this is equivalent to
		* socket.emit("message", "hello");
		*
		* @return self
		*/
		send(...args) {
			args.unshift("message");
			this.emit.apply(this, args);
			return this;
		}
		/**
		* Override `emit`.
		* If the event is in `events`, it's emitted normally.
		*
		* @example
		* socket.emit("hello", "world");
		*
		* // all serializable datastructures are supported (no need to call JSON.stringify)
		* socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
		*
		* // with an acknowledgement from the server
		* socket.emit("hello", "world", (val) => {
		*   // ...
		* });
		*
		* @return self
		*/
		emit(ev, ...args) {
			var _a, _b, _c;
			if (RESERVED_EVENTS.hasOwnProperty(ev)) throw new Error("\"" + ev.toString() + "\" is a reserved event name");
			args.unshift(ev);
			if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
				this._addToQueue(args);
				return this;
			}
			const packet = {
				type: PacketType.EVENT,
				data: args
			};
			packet.options = {};
			packet.options.compress = this.flags.compress !== false;
			if ("function" === typeof args[args.length - 1]) {
				const id = this.ids++;
				const ack = args.pop();
				this._registerAckCallback(id, ack);
				packet.id = id;
			}
			const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
			const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
			if (this.flags.volatile && !isTransportWritable) {} else if (isConnected) {
				this.notifyOutgoingListeners(packet);
				this.packet(packet);
			} else this.sendBuffer.push(packet);
			this.flags = {};
			return this;
		}
		/**
		* @private
		*/
		_registerAckCallback(id, ack) {
			var _a;
			const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
			if (timeout === void 0) {
				this.acks[id] = ack;
				return;
			}
			const timer = this.io.setTimeoutFn(() => {
				delete this.acks[id];
				for (let i = 0; i < this.sendBuffer.length; i++) if (this.sendBuffer[i].id === id) this.sendBuffer.splice(i, 1);
				ack.call(this, /* @__PURE__ */ new Error("operation has timed out"));
			}, timeout);
			const fn = (...args) => {
				this.io.clearTimeoutFn(timer);
				ack.apply(this, args);
			};
			fn.withError = true;
			this.acks[id] = fn;
		}
		/**
		* Emits an event and waits for an acknowledgement
		*
		* @example
		* // without timeout
		* const response = await socket.emitWithAck("hello", "world");
		*
		* // with a specific timeout
		* try {
		*   const response = await socket.timeout(1000).emitWithAck("hello", "world");
		* } catch (err) {
		*   // the server did not acknowledge the event in the given delay
		* }
		*
		* @return a Promise that will be fulfilled when the server acknowledges the event
		*/
		emitWithAck(ev, ...args) {
			return new Promise((resolve, reject) => {
				const fn = (arg1, arg2) => {
					return arg1 ? reject(arg1) : resolve(arg2);
				};
				fn.withError = true;
				args.push(fn);
				this.emit(ev, ...args);
			});
		}
		/**
		* Add the packet to the queue.
		* @param args
		* @private
		*/
		_addToQueue(args) {
			let ack;
			if (typeof args[args.length - 1] === "function") ack = args.pop();
			const packet = {
				id: this._queueSeq++,
				tryCount: 0,
				pending: false,
				args,
				flags: Object.assign({ fromQueue: true }, this.flags)
			};
			args.push((err, ...responseArgs) => {
				if (packet !== this._queue[0]) {}
				if (err !== null) {
					if (packet.tryCount > this._opts.retries) {
						this._queue.shift();
						if (ack) ack(err);
					}
				} else {
					this._queue.shift();
					if (ack) ack(null, ...responseArgs);
				}
				packet.pending = false;
				return this._drainQueue();
			});
			this._queue.push(packet);
			this._drainQueue();
		}
		/**
		* Send the first packet of the queue, and wait for an acknowledgement from the server.
		* @param force - whether to resend a packet that has not been acknowledged yet
		*
		* @private
		*/
		_drainQueue(force = false) {
			if (!this.connected || this._queue.length === 0) return;
			const packet = this._queue[0];
			if (packet.pending && !force) return;
			packet.pending = true;
			packet.tryCount++;
			this.flags = packet.flags;
			this.emit.apply(this, packet.args);
		}
		/**
		* Sends a packet.
		*
		* @param packet
		* @private
		*/
		packet(packet) {
			packet.nsp = this.nsp;
			this.io._packet(packet);
		}
		/**
		* Called upon engine `open`.
		*
		* @private
		*/
		onopen() {
			if (typeof this.auth == "function") this.auth((data) => {
				this._sendConnectPacket(data);
			});
			else this._sendConnectPacket(this.auth);
		}
		/**
		* Sends a CONNECT packet to initiate the Socket.IO session.
		*
		* @param data
		* @private
		*/
		_sendConnectPacket(data) {
			this.packet({
				type: PacketType.CONNECT,
				data: this._pid ? Object.assign({
					pid: this._pid,
					offset: this._lastOffset
				}, data) : data
			});
		}
		/**
		* Called upon engine or manager `error`.
		*
		* @param err
		* @private
		*/
		onerror(err) {
			if (!this.connected) this.emitReserved("connect_error", err);
		}
		/**
		* Called upon engine `close`.
		*
		* @param reason
		* @param description
		* @private
		*/
		onclose(reason, description) {
			this.connected = false;
			delete this.id;
			this.emitReserved("disconnect", reason, description);
			this._clearAcks();
		}
		/**
		* Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
		* the server.
		*
		* @private
		*/
		_clearAcks() {
			Object.keys(this.acks).forEach((id) => {
				if (!this.sendBuffer.some((packet) => String(packet.id) === id)) {
					const ack = this.acks[id];
					delete this.acks[id];
					if (ack.withError) ack.call(this, /* @__PURE__ */ new Error("socket has been disconnected"));
				}
			});
		}
		/**
		* Called with socket packet.
		*
		* @param packet
		* @private
		*/
		onpacket(packet) {
			if (!(packet.nsp === this.nsp)) return;
			switch (packet.type) {
				case PacketType.CONNECT:
					if (packet.data && packet.data.sid) this.onconnect(packet.data.sid, packet.data.pid);
					else this.emitReserved("connect_error", /* @__PURE__ */ new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
					break;
				case PacketType.EVENT:
				case PacketType.BINARY_EVENT:
					this.onevent(packet);
					break;
				case PacketType.ACK:
				case PacketType.BINARY_ACK:
					this.onack(packet);
					break;
				case PacketType.DISCONNECT:
					this.ondisconnect();
					break;
				case PacketType.CONNECT_ERROR:
					this.destroy();
					const err = new Error(packet.data.message);
					err.data = packet.data.data;
					this.emitReserved("connect_error", err);
					break;
			}
		}
		/**
		* Called upon a server event.
		*
		* @param packet
		* @private
		*/
		onevent(packet) {
			const args = packet.data || [];
			if (null != packet.id) args.push(this.ack(packet.id));
			if (this.connected) this.emitEvent(args);
			else this.receiveBuffer.push(Object.freeze(args));
		}
		emitEvent(args) {
			if (this._anyListeners && this._anyListeners.length) {
				const listeners = this._anyListeners.slice();
				for (const listener of listeners) listener.apply(this, args);
			}
			super.emit.apply(this, args);
			if (this._pid && args.length && typeof args[args.length - 1] === "string") this._lastOffset = args[args.length - 1];
		}
		/**
		* Produces an ack callback to emit with an event.
		*
		* @private
		*/
		ack(id) {
			const self = this;
			let sent = false;
			return function(...args) {
				if (sent) return;
				sent = true;
				self.packet({
					type: PacketType.ACK,
					id,
					data: args
				});
			};
		}
		/**
		* Called upon a server acknowledgement.
		*
		* @param packet
		* @private
		*/
		onack(packet) {
			const ack = this.acks[packet.id];
			if (typeof ack !== "function") return;
			delete this.acks[packet.id];
			if (ack.withError) packet.data.unshift(null);
			ack.apply(this, packet.data);
		}
		/**
		* Called upon server connect.
		*
		* @private
		*/
		onconnect(id, pid) {
			this.id = id;
			this.recovered = pid && this._pid === pid;
			this._pid = pid;
			this.connected = true;
			this.emitBuffered();
			this._drainQueue(true);
			this.emitReserved("connect");
		}
		/**
		* Emit buffered events (received and emitted).
		*
		* @private
		*/
		emitBuffered() {
			this.receiveBuffer.forEach((args) => this.emitEvent(args));
			this.receiveBuffer = [];
			this.sendBuffer.forEach((packet) => {
				this.notifyOutgoingListeners(packet);
				this.packet(packet);
			});
			this.sendBuffer = [];
		}
		/**
		* Called upon server disconnect.
		*
		* @private
		*/
		ondisconnect() {
			this.destroy();
			this.onclose("io server disconnect");
		}
		/**
		* Called upon forced client/server side disconnections,
		* this method ensures the manager stops tracking us and
		* that reconnections don't get triggered for this.
		*
		* @private
		*/
		destroy() {
			if (this.subs) {
				this.subs.forEach((subDestroy) => subDestroy());
				this.subs = void 0;
			}
			this.io["_destroy"](this);
		}
		/**
		* Disconnects the socket manually. In that case, the socket will not try to reconnect.
		*
		* If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
		*
		* @example
		* const socket = io();
		*
		* socket.on("disconnect", (reason) => {
		*   // console.log(reason); prints "io client disconnect"
		* });
		*
		* socket.disconnect();
		*
		* @return self
		*/
		disconnect() {
			if (this.connected) this.packet({ type: PacketType.DISCONNECT });
			this.destroy();
			if (this.connected) this.onclose("io client disconnect");
			return this;
		}
		/**
		* Alias for {@link disconnect()}.
		*
		* @return self
		*/
		close() {
			return this.disconnect();
		}
		/**
		* Sets the compress flag.
		*
		* @example
		* socket.compress(false).emit("hello");
		*
		* @param compress - if `true`, compresses the sending data
		* @return self
		*/
		compress(compress) {
			this.flags.compress = compress;
			return this;
		}
		/**
		* Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
		* ready to send messages.
		*
		* @example
		* socket.volatile.emit("hello"); // the server may or may not receive it
		*
		* @returns self
		*/
		get volatile() {
			this.flags.volatile = true;
			return this;
		}
		/**
		* Sets a modifier for a subsequent event emission that the callback will be called with an error when the
		* given number of milliseconds have elapsed without an acknowledgement from the server:
		*
		* @example
		* socket.timeout(5000).emit("my-event", (err) => {
		*   if (err) {
		*     // the server did not acknowledge the event in the given delay
		*   }
		* });
		*
		* @returns self
		*/
		timeout(timeout) {
			this.flags.timeout = timeout;
			return this;
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback.
		*
		* @example
		* socket.onAny((event, ...args) => {
		*   console.log(`got ${event}`);
		* });
		*
		* @param listener
		*/
		onAny(listener) {
			this._anyListeners = this._anyListeners || [];
			this._anyListeners.push(listener);
			return this;
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback. The listener is added to the beginning of the listeners array.
		*
		* @example
		* socket.prependAny((event, ...args) => {
		*   console.log(`got event ${event}`);
		* });
		*
		* @param listener
		*/
		prependAny(listener) {
			this._anyListeners = this._anyListeners || [];
			this._anyListeners.unshift(listener);
			return this;
		}
		/**
		* Removes the listener that will be fired when any event is emitted.
		*
		* @example
		* const catchAllListener = (event, ...args) => {
		*   console.log(`got event ${event}`);
		* }
		*
		* socket.onAny(catchAllListener);
		*
		* // remove a specific listener
		* socket.offAny(catchAllListener);
		*
		* // or remove all listeners
		* socket.offAny();
		*
		* @param listener
		*/
		offAny(listener) {
			if (!this._anyListeners) return this;
			if (listener) {
				const listeners = this._anyListeners;
				for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
					listeners.splice(i, 1);
					return this;
				}
			} else this._anyListeners = [];
			return this;
		}
		/**
		* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
		* e.g. to remove listeners.
		*/
		listenersAny() {
			return this._anyListeners || [];
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback.
		*
		* Note: acknowledgements sent to the server are not included.
		*
		* @example
		* socket.onAnyOutgoing((event, ...args) => {
		*   console.log(`sent event ${event}`);
		* });
		*
		* @param listener
		*/
		onAnyOutgoing(listener) {
			this._anyOutgoingListeners = this._anyOutgoingListeners || [];
			this._anyOutgoingListeners.push(listener);
			return this;
		}
		/**
		* Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
		* callback. The listener is added to the beginning of the listeners array.
		*
		* Note: acknowledgements sent to the server are not included.
		*
		* @example
		* socket.prependAnyOutgoing((event, ...args) => {
		*   console.log(`sent event ${event}`);
		* });
		*
		* @param listener
		*/
		prependAnyOutgoing(listener) {
			this._anyOutgoingListeners = this._anyOutgoingListeners || [];
			this._anyOutgoingListeners.unshift(listener);
			return this;
		}
		/**
		* Removes the listener that will be fired when any event is emitted.
		*
		* @example
		* const catchAllListener = (event, ...args) => {
		*   console.log(`sent event ${event}`);
		* }
		*
		* socket.onAnyOutgoing(catchAllListener);
		*
		* // remove a specific listener
		* socket.offAnyOutgoing(catchAllListener);
		*
		* // or remove all listeners
		* socket.offAnyOutgoing();
		*
		* @param [listener] - the catch-all listener (optional)
		*/
		offAnyOutgoing(listener) {
			if (!this._anyOutgoingListeners) return this;
			if (listener) {
				const listeners = this._anyOutgoingListeners;
				for (let i = 0; i < listeners.length; i++) if (listener === listeners[i]) {
					listeners.splice(i, 1);
					return this;
				}
			} else this._anyOutgoingListeners = [];
			return this;
		}
		/**
		* Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
		* e.g. to remove listeners.
		*/
		listenersAnyOutgoing() {
			return this._anyOutgoingListeners || [];
		}
		/**
		* Notify the listeners for each packet sent
		*
		* @param packet
		*
		* @private
		*/
		notifyOutgoingListeners(packet) {
			if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
				const listeners = this._anyOutgoingListeners.slice();
				for (const listener of listeners) listener.apply(this, packet.data);
			}
		}
	};
	//#endregion
	//#region node_modules/socket.io-client/build/esm/contrib/backo2.js
	/**
	* Initialize backoff timer with `opts`.
	*
	* - `min` initial timeout in milliseconds [100]
	* - `max` max timeout [10000]
	* - `jitter` [0]
	* - `factor` [2]
	*
	* @param {Object} opts
	* @api public
	*/
	function Backoff(opts) {
		opts = opts || {};
		this.ms = opts.min || 100;
		this.max = opts.max || 1e4;
		this.factor = opts.factor || 2;
		this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
		this.attempts = 0;
	}
	/**
	* Return the backoff duration.
	*
	* @return {Number}
	* @api public
	*/
	Backoff.prototype.duration = function() {
		var ms = this.ms * Math.pow(this.factor, this.attempts++);
		if (this.jitter) {
			var rand = Math.random();
			var deviation = Math.floor(rand * this.jitter * ms);
			ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
		}
		return Math.min(ms, this.max) | 0;
	};
	/**
	* Reset the number of attempts.
	*
	* @api public
	*/
	Backoff.prototype.reset = function() {
		this.attempts = 0;
	};
	/**
	* Set the minimum duration
	*
	* @api public
	*/
	Backoff.prototype.setMin = function(min) {
		this.ms = min;
	};
	/**
	* Set the maximum duration
	*
	* @api public
	*/
	Backoff.prototype.setMax = function(max) {
		this.max = max;
	};
	/**
	* Set the jitter
	*
	* @api public
	*/
	Backoff.prototype.setJitter = function(jitter) {
		this.jitter = jitter;
	};
	//#endregion
	//#region node_modules/socket.io-client/build/esm/manager.js
	var Manager = class extends Emitter {
		constructor(uri, opts) {
			var _a;
			super();
			this.nsps = {};
			this.subs = [];
			if (uri && "object" === typeof uri) {
				opts = uri;
				uri = void 0;
			}
			opts = opts || {};
			opts.path = opts.path || "/socket.io";
			this.opts = opts;
			installTimerFunctions(this, opts);
			this.reconnection(opts.reconnection !== false);
			this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
			this.reconnectionDelay(opts.reconnectionDelay || 1e3);
			this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
			this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : .5);
			this.backoff = new Backoff({
				min: this.reconnectionDelay(),
				max: this.reconnectionDelayMax(),
				jitter: this.randomizationFactor()
			});
			this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
			this._readyState = "closed";
			this.uri = uri;
			const _parser = opts.parser || esm_exports;
			this.encoder = new _parser.Encoder();
			this.decoder = new _parser.Decoder();
			this._autoConnect = opts.autoConnect !== false;
			if (this._autoConnect) this.open();
		}
		reconnection(v) {
			if (!arguments.length) return this._reconnection;
			this._reconnection = !!v;
			if (!v) this.skipReconnect = true;
			return this;
		}
		reconnectionAttempts(v) {
			if (v === void 0) return this._reconnectionAttempts;
			this._reconnectionAttempts = v;
			return this;
		}
		reconnectionDelay(v) {
			var _a;
			if (v === void 0) return this._reconnectionDelay;
			this._reconnectionDelay = v;
			(_a = this.backoff) === null || _a === void 0 || _a.setMin(v);
			return this;
		}
		randomizationFactor(v) {
			var _a;
			if (v === void 0) return this._randomizationFactor;
			this._randomizationFactor = v;
			(_a = this.backoff) === null || _a === void 0 || _a.setJitter(v);
			return this;
		}
		reconnectionDelayMax(v) {
			var _a;
			if (v === void 0) return this._reconnectionDelayMax;
			this._reconnectionDelayMax = v;
			(_a = this.backoff) === null || _a === void 0 || _a.setMax(v);
			return this;
		}
		timeout(v) {
			if (!arguments.length) return this._timeout;
			this._timeout = v;
			return this;
		}
		/**
		* Starts trying to reconnect if reconnection is enabled and we have not
		* started reconnecting yet
		*
		* @private
		*/
		maybeReconnectOnOpen() {
			if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) this.reconnect();
		}
		/**
		* Sets the current transport `socket`.
		*
		* @param {Function} fn - optional, callback
		* @return self
		* @public
		*/
		open(fn) {
			if (~this._readyState.indexOf("open")) return this;
			this.engine = new Socket$1(this.uri, this.opts);
			const socket = this.engine;
			const self = this;
			this._readyState = "opening";
			this.skipReconnect = false;
			const openSubDestroy = on(socket, "open", function() {
				self.onopen();
				fn && fn();
			});
			const onError = (err) => {
				this.cleanup();
				this._readyState = "closed";
				this.emitReserved("error", err);
				if (fn) fn(err);
				else this.maybeReconnectOnOpen();
			};
			const errorSub = on(socket, "error", onError);
			if (false !== this._timeout) {
				const timeout = this._timeout;
				const timer = this.setTimeoutFn(() => {
					openSubDestroy();
					onError(/* @__PURE__ */ new Error("timeout"));
					socket.close();
				}, timeout);
				if (this.opts.autoUnref) timer.unref();
				this.subs.push(() => {
					this.clearTimeoutFn(timer);
				});
			}
			this.subs.push(openSubDestroy);
			this.subs.push(errorSub);
			return this;
		}
		/**
		* Alias for open()
		*
		* @return self
		* @public
		*/
		connect(fn) {
			return this.open(fn);
		}
		/**
		* Called upon transport open.
		*
		* @private
		*/
		onopen() {
			this.cleanup();
			this._readyState = "open";
			this.emitReserved("open");
			const socket = this.engine;
			this.subs.push(on(socket, "ping", this.onping.bind(this)), on(socket, "data", this.ondata.bind(this)), on(socket, "error", this.onerror.bind(this)), on(socket, "close", this.onclose.bind(this)), on(this.decoder, "decoded", this.ondecoded.bind(this)));
		}
		/**
		* Called upon a ping.
		*
		* @private
		*/
		onping() {
			this.emitReserved("ping");
		}
		/**
		* Called with data.
		*
		* @private
		*/
		ondata(data) {
			try {
				this.decoder.add(data);
			} catch (e) {
				this.onclose("parse error", e);
			}
		}
		/**
		* Called when parser fully decodes a packet.
		*
		* @private
		*/
		ondecoded(packet) {
			nextTick(() => {
				this.emitReserved("packet", packet);
			}, this.setTimeoutFn);
		}
		/**
		* Called upon socket error.
		*
		* @private
		*/
		onerror(err) {
			this.emitReserved("error", err);
		}
		/**
		* Creates a new socket for the given `nsp`.
		*
		* @return {Socket}
		* @public
		*/
		socket(nsp, opts) {
			let socket = this.nsps[nsp];
			if (!socket) {
				socket = new Socket(this, nsp, opts);
				this.nsps[nsp] = socket;
			} else if (this._autoConnect && !socket.active) socket.connect();
			return socket;
		}
		/**
		* Called upon a socket close.
		*
		* @param socket
		* @private
		*/
		_destroy(socket) {
			const nsps = Object.keys(this.nsps);
			for (const nsp of nsps) if (this.nsps[nsp].active) return;
			this._close();
		}
		/**
		* Writes a packet.
		*
		* @param packet
		* @private
		*/
		_packet(packet) {
			const encodedPackets = this.encoder.encode(packet);
			for (let i = 0; i < encodedPackets.length; i++) this.engine.write(encodedPackets[i], packet.options);
		}
		/**
		* Clean up transport subscriptions and packet buffer.
		*
		* @private
		*/
		cleanup() {
			this.subs.forEach((subDestroy) => subDestroy());
			this.subs.length = 0;
			this.decoder.destroy();
		}
		/**
		* Close the current socket.
		*
		* @private
		*/
		_close() {
			this.skipReconnect = true;
			this._reconnecting = false;
			this.onclose("forced close");
		}
		/**
		* Alias for close()
		*
		* @private
		*/
		disconnect() {
			return this._close();
		}
		/**
		* Called when:
		*
		* - the low-level engine is closed
		* - the parser encountered a badly formatted packet
		* - all sockets are disconnected
		*
		* @private
		*/
		onclose(reason, description) {
			var _a;
			this.cleanup();
			(_a = this.engine) === null || _a === void 0 || _a.close();
			this.backoff.reset();
			this._readyState = "closed";
			this.emitReserved("close", reason, description);
			if (this._reconnection && !this.skipReconnect) this.reconnect();
		}
		/**
		* Attempt a reconnection.
		*
		* @private
		*/
		reconnect() {
			if (this._reconnecting || this.skipReconnect) return this;
			const self = this;
			if (this.backoff.attempts >= this._reconnectionAttempts) {
				this.backoff.reset();
				this.emitReserved("reconnect_failed");
				this._reconnecting = false;
			} else {
				const delay = this.backoff.duration();
				this._reconnecting = true;
				const timer = this.setTimeoutFn(() => {
					if (self.skipReconnect) return;
					this.emitReserved("reconnect_attempt", self.backoff.attempts);
					if (self.skipReconnect) return;
					self.open((err) => {
						if (err) {
							self._reconnecting = false;
							self.reconnect();
							this.emitReserved("reconnect_error", err);
						} else self.onreconnect();
					});
				}, delay);
				if (this.opts.autoUnref) timer.unref();
				this.subs.push(() => {
					this.clearTimeoutFn(timer);
				});
			}
		}
		/**
		* Called upon successful reconnect.
		*
		* @private
		*/
		onreconnect() {
			const attempt = this.backoff.attempts;
			this._reconnecting = false;
			this.backoff.reset();
			this.emitReserved("reconnect", attempt);
		}
	};
	//#endregion
	//#region node_modules/socket.io-client/build/esm/index.js
	/**
	* Managers cache.
	*/
	var cache = {};
	function lookup(uri, opts) {
		if (typeof uri === "object") {
			opts = uri;
			uri = void 0;
		}
		opts = opts || {};
		const parsed = url(uri, opts.path || "/socket.io");
		const source = parsed.source;
		const id = parsed.id;
		const path = parsed.path;
		const sameNamespace = cache[id] && path in cache[id]["nsps"];
		const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
		let io;
		if (newConnection) io = new Manager(source, opts);
		else {
			if (!cache[id]) cache[id] = new Manager(source, opts);
			io = cache[id];
		}
		if (parsed.query && !opts.query) opts.query = parsed.queryKey;
		return io.socket(parsed.path, opts);
	}
	Object.assign(lookup, {
		Manager,
		Socket,
		io: lookup,
		connect: lookup
	});
	//#endregion
	//#region src/SocketClient.svelte
	function SocketClient($$anchor, $$props) {
		push($$props, true);
		let connected = prop($$props, "connected", 15, false);
		user_effect(() => {
			const socket = lookup({ transports: ["websocket"] });
			connected(socket.connected);
			socket.on("connect", () => {
				connected(socket.connected);
			});
			socket.on("disconnect", () => {
				connected(socket.connected);
			});
			$$props.socketLoad(socket);
			return () => socket.close();
		});
		pop();
	}
	//#endregion
	//#region src/deviceInfo.js
	/** Leading percentage from a battery string, or null if there isn't one. */
	function batteryPct(value) {
		const match = /(\d+)\s*%/.exec(value || "");
		return match ? parseInt(match[1], 10) : null;
	}
	/**
	* UAParser reports vendor/model for most phones but nothing for desktops,
	* so fall back to inferring from the OS string.
	*/
	function guessDevice(entry) {
		if (entry.device) return entry.device;
		const os = (entry.os || "").toLowerCase();
		if (os.indexOf("ios") === 0) return "iPhone / iPad";
		if (os.indexOf("android") === 0) return "Android device";
		if (os.indexOf("mac") === 0) return "Mac";
		if (os.indexOf("windows") === 0) return "Windows PC";
		if (os.indexOf("chrom") === 0) return "Chromebook";
		if (os.indexOf("linux") === 0 || os.indexOf("ubuntu") === 0) return "Linux PC";
		return "Unknown";
	}
	/**
	* Battery ascending. Entries whose battery can't be parsed — "blocked" on
	* Safari and Firefox, or a missing field — sink to the bottom, ordered by
	* browser. Sorts in place and returns the array.
	*/
	function sortEntries(rows) {
		return rows.sort((a, b) => {
			const pa = batteryPct(a.battery);
			const pb = batteryPct(b.battery);
			if (pa === null && pb === null) return (a.browser || "").localeCompare(b.browser || "");
			if (pa === null) return 1;
			if (pb === null) return -1;
			return pa - pb;
		});
	}
	var INFO_COLUMNS = [
		{
			label: "Device",
			get: (e) => guessDevice(e)
		},
		{
			label: "Battery",
			get: (e) => e.battery || "n/a",
			numeric: true
		},
		{
			label: "Dark Mode",
			get: (e) => e.darkMode || "n/a"
		},
		{
			label: "OS",
			get: (e) => e.os || "n/a"
		},
		{
			label: "Browser",
			get: (e) => e.browser || "n/a"
		},
		{
			label: "IP",
			get: (e) => e.ip || "n/a"
		},
		{
			label: "ISP",
			get: (e) => e.isp || "n/a"
		},
		{
			label: "Location",
			get: (e) => e.location || "n/a"
		}
	];
	/** "0 devices" / "1 device" / "N devices" */
	function deviceCountLabel(n) {
		return n === 1 ? "1 device" : `${n} devices`;
	}
	//#endregion
	//#region src/InfoPanel.svelte
	var root$1 = /* @__PURE__ */ from_html(`<div class="info-empty svelte-1bakkyt">No devices captured yet.</div>`);
	var root_1$1 = /* @__PURE__ */ from_html(`<th> </th>`);
	var root_2$1 = /* @__PURE__ */ from_html(`<td> </td>`);
	var root_3$1 = /* @__PURE__ */ from_html(`<tr class="svelte-1bakkyt"></tr>`);
	var root_4$1 = /* @__PURE__ */ from_html(`<table class="info-table svelte-1bakkyt"><thead><tr></tr></thead><tbody class="svelte-1bakkyt"></tbody></table>`);
	var root_5$1 = /* @__PURE__ */ from_html(`<div class="info-wrap svelte-1bakkyt"><!></div> <div class="info-count svelte-1bakkyt"> </div>`, 1);
	function InfoPanel($$anchor, $$props) {
		push($$props, true);
		let entries = prop($$props, "entries", 19, () => ({}));
		const rows = /* @__PURE__ */ user_derived(() => sortEntries(Object.values(entries())));
		var fragment = root_5$1();
		var div = first_child(fragment);
		var node = child(div);
		var consequent = ($$anchor) => {
			append($$anchor, root$1());
		};
		var alternate = ($$anchor) => {
			var table = root_4$1();
			var thead = child(table);
			var tr = child(thead);
			each(tr, 21, () => INFO_COLUMNS, index, ($$anchor, col) => {
				var th = root_1$1();
				let classes;
				var text = child(th, true);
				reset(th);
				template_effect(() => {
					classes = set_class(th, 1, "svelte-1bakkyt", null, classes, { "info-num": get(col).numeric });
					set_text(text, get(col).label);
				});
				append($$anchor, th);
			});
			reset(tr);
			reset(thead);
			var tbody = sibling(thead);
			each(tbody, 21, () => get(rows), index, ($$anchor, entry) => {
				var tr_1 = root_3$1();
				each(tr_1, 21, () => INFO_COLUMNS, index, ($$anchor, col) => {
					var td = root_2$1();
					let classes_1;
					var text_1 = child(td, true);
					reset(td);
					template_effect(($0) => {
						classes_1 = set_class(td, 1, "svelte-1bakkyt", null, classes_1, { "info-num": get(col).numeric });
						set_text(text_1, $0);
					}, [() => get(col).get(get(entry))]);
					append($$anchor, td);
				});
				reset(tr_1);
				append($$anchor, tr_1);
			});
			reset(tbody);
			reset(table);
			append($$anchor, table);
		};
		if_block(node, ($$render) => {
			if (get(rows).length === 0) $$render(consequent);
			else $$render(alternate, -1);
		});
		reset(div);
		var div_2 = sibling(div, 2);
		var text_2 = child(div_2, true);
		reset(div_2);
		template_effect(($0) => set_text(text_2, $0), [() => deviceCountLabel(get(rows).length)]);
		append($$anchor, fragment);
		pop();
	}
	//#endregion
	//#region node_modules/ua-parser-js/src/main/ua-parser.mjs
	var LIBVERSION = "2.0.10";
	var UA_MAX_LENGTH = 500;
	var USER_AGENT = "user-agent";
	var EMPTY = "";
	var UNKNOWN = "?";
	var TYPEOF = {
		FUNCTION: "function",
		OBJECT: "object",
		STRING: "string",
		UNDEFINED: "undefined"
	};
	var BROWSER = "browser";
	var CPU = "cpu";
	var DEVICE = "device";
	var ENGINE = "engine";
	var OS = "os";
	var RESULT = "result";
	var NAME = "name";
	var TYPE = "type";
	var VENDOR = "vendor";
	var VERSION = "version";
	var ARCHITECTURE = "architecture";
	var MAJOR = "major";
	var MODEL = "model";
	var CONSOLE = "console";
	var MOBILE = "mobile";
	var TABLET = "tablet";
	var SMARTTV = "smarttv";
	var WEARABLE = "wearable";
	var XR = "xr";
	var EMBEDDED = "embedded";
	var FETCHER = "fetcher";
	var INAPP = "inapp";
	var BRANDS = "brands";
	var FORMFACTORS = "formFactors";
	var FULLVERLIST = "fullVersionList";
	var PLATFORM = "platform";
	var PLATFORMVER = "platformVersion";
	var BITNESS = "bitness";
	var CH = "sec-ch-ua";
	var CH_FULL_VER_LIST = CH + "-full-version-list";
	var CH_ARCH = CH + "-arch";
	var CH_BITNESS = CH + "-" + BITNESS;
	var CH_FORM_FACTORS = CH + "-form-factors";
	var CH_MOBILE = CH + "-" + MOBILE;
	var CH_MODEL = CH + "-" + MODEL;
	var CH_PLATFORM = CH + "-" + PLATFORM;
	var CH_PLATFORM_VER = CH_PLATFORM + "-version";
	var CH_ALL_VALUES = [
		BRANDS,
		FULLVERLIST,
		MOBILE,
		MODEL,
		PLATFORM,
		PLATFORMVER,
		ARCHITECTURE,
		FORMFACTORS,
		BITNESS
	];
	var AMAZON = "Amazon";
	var APPLE = "Apple";
	var ASUS = "ASUS";
	var BLACKBERRY = "BlackBerry";
	var GOOGLE = "Google";
	var HUAWEI = "Huawei";
	var LENOVO = "Lenovo";
	var HONOR = "Honor";
	var LG = "LG";
	var MICROSOFT = "Microsoft";
	var MOTOROLA = "Motorola";
	var NVIDIA = "Nvidia";
	var ONEPLUS = "OnePlus";
	var OPPO = "OPPO";
	var SAMSUNG = "Samsung";
	var SHARP = "Sharp";
	var SONY = "Sony";
	var XIAOMI = "Xiaomi";
	var ZEBRA = "Zebra";
	var CHROME = "Chrome";
	var CHROMIUM = "Chromium";
	var CHROMECAST = "Chromecast";
	var EDGE = "Edge";
	var FIREFOX = "Firefox";
	var OPERA = "Opera";
	var FACEBOOK = "Facebook";
	var SOGOU = "Sogou";
	var PREFIX_MOBILE = "Mobile ";
	var SUFFIX_BROWSER = " Browser";
	var WINDOWS = "Windows";
	var NAVIGATOR = typeof window !== TYPEOF.UNDEFINED && window.navigator ? window.navigator : void 0;
	var NAVIGATOR_UADATA = NAVIGATOR && NAVIGATOR.userAgentData ? NAVIGATOR.userAgentData : void 0;
	var extend = function(defaultRgx, extensions) {
		var mergedRgx = {};
		var extraRgx = extensions;
		if (!isExtensions(extensions)) {
			extraRgx = {};
			for (var i in extensions) for (var j in extensions[i]) extraRgx[j] = extensions[i][j].concat(extraRgx[j] ? extraRgx[j] : []);
		}
		for (var k in defaultRgx) mergedRgx[k] = extraRgx[k] && extraRgx[k].length % 2 === 0 ? extraRgx[k].concat(defaultRgx[k]) : defaultRgx[k];
		return mergedRgx;
	};
	var enumerize = function(arr) {
		var enums = {};
		for (var i = 0; i < arr.length; i++) enums[arr[i].toUpperCase()] = arr[i];
		return enums;
	};
	var has = function(str1, str2) {
		if (typeof str1 === TYPEOF.OBJECT && str1.length > 0) {
			for (var i in str1) if (lowerize(str2) == lowerize(str1[i])) return true;
			return false;
		}
		return isString(str1) ? lowerize(str2) == lowerize(str1) : false;
	};
	var isExtensions = function(obj, deep) {
		for (var prop in obj) return /^(browser|cpu|device|engine|os)$/.test(prop) || (deep ? isExtensions(obj[prop]) : false);
	};
	var isString = function(val) {
		return typeof val === TYPEOF.STRING;
	};
	var itemListToArray = function(header) {
		if (!header) return void 0;
		var arr = [];
		var tokens = normalizeHeaderValue(header).split(",");
		for (var i = 0; i < tokens.length; i++) if (tokens[i].indexOf(";") > -1) {
			var token = trim(tokens[i]).split(";v=");
			arr[i] = {
				brand: token[0],
				version: token[1]
			};
		} else arr[i] = trim(tokens[i]);
		return arr;
	};
	var lowerize = function(str) {
		return isString(str) ? str.toLowerCase() : str;
	};
	var majorize = function(version) {
		return isString(version) ? strip(/[^\d\.]/g, version).split(".")[0] : void 0;
	};
	var normalizeHeaderValue = function(str) {
		return isString(str) ? trim(strip(/\\?\"/g, str), UA_MAX_LENGTH) : void 0;
	};
	var setProps = function(arr) {
		for (var i in arr) {
			if (!arr.hasOwnProperty(i)) continue;
			var propName = arr[i];
			if (typeof propName == TYPEOF.OBJECT && propName.length == 2) this[propName[0]] = propName[1];
			else this[propName] = void 0;
		}
		return this;
	};
	var strip = function(pattern, str) {
		return isString(str) ? str.replace(pattern, EMPTY) : str;
	};
	var trim = function(str, len) {
		str = strip(/^\s\s*/, String(str));
		return typeof len === TYPEOF.UNDEFINED ? str : str.substring(0, len);
	};
	var rgxMapper = function(ua, arrays) {
		if (!ua || !arrays) return;
		var i = 0, j, k, p, q, matches, match;
		while (i < arrays.length && !matches) {
			var regex = arrays[i], props = arrays[i + 1];
			j = k = 0;
			while (j < regex.length && !matches) {
				if (!regex[j]) break;
				matches = regex[j++].exec(ua);
				if (!!matches) for (p = 0; p < props.length; p++) {
					match = matches[++k];
					q = props[p];
					if (typeof q === TYPEOF.OBJECT && q.length > 0) {
						if (q.length === 2) if (typeof q[1] == TYPEOF.FUNCTION) this[q[0]] = q[1].call(this, match);
						else this[q[0]] = q[1];
						else if (q.length >= 3) {
							if (typeof q[1] === TYPEOF.FUNCTION && !(q[1].exec && q[1].test)) if (q.length > 3) this[q[0]] = match ? q[1].apply(this, q.slice(2)) : void 0;
							else this[q[0]] = match ? q[1].call(this, match, q[2]) : void 0;
							else if (q.length == 3) this[q[0]] = match ? match.replace(q[1], q[2]) : void 0;
							else if (q.length == 4) this[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : void 0;
							else if (q.length > 4) this[q[0]] = match ? q[3].apply(this, [match.replace(q[1], q[2])].concat(q.slice(4))) : void 0;
						}
					} else this[q] = match ? match : void 0;
				}
			}
			i += 2;
		}
	};
	var strTest = function(str, map) {
		return map.test.test(str) ? map.ifTrue : map.ifFalse;
	};
	var strMapper = function(str, map) {
		for (var i in map) if (typeof map[i] === TYPEOF.OBJECT && map[i].length > 0) {
			for (var j = 0; j < map[i].length; j++) if (has(map[i][j], str)) return i === UNKNOWN ? void 0 : i;
		} else if (has(map[i], str)) return i === UNKNOWN ? void 0 : i;
		return map.hasOwnProperty("*") ? map["*"] : str;
	};
	var windowsVersionMap = {
		"ME": "4.90",
		"NT 3.51": "3.51",
		"NT 4.0": "4.0",
		"2000": ["5.0", "5.01"],
		"XP": ["5.1", "5.2"],
		"Vista": "6.0",
		"7": "6.1",
		"8": "6.2",
		"8.1": "6.3",
		"10": ["6.4", "10.0"],
		"NT": ""
	};
	var formFactorsMap = {
		"embedded": "Automotive",
		"mobile": "Mobile",
		"tablet": ["Tablet", "EInk"],
		"smarttv": "TV",
		"wearable": "Watch",
		"xr": ["VR", "XR"],
		"?": ["Desktop", "Unknown"],
		"*": void 0
	};
	var browserHintsMap = {
		"Chrome": "Google Chrome",
		"Edge": "Microsoft Edge",
		"Edge WebView2": "Microsoft Edge WebView2",
		"Chrome WebView": "Android WebView",
		"Chrome Headless": "HeadlessChrome",
		"Huawei Browser": "HuaweiBrowser",
		"MIUI Browser": "Miui Browser",
		"Opera Mobi": "OperaMobile",
		"Yandex": "YaBrowser"
	};
	var defaultRegexes = {
		browser: [
			[/\b(?:crmo|crios)\/([\w\.]+)/i],
			[VERSION, [NAME, PREFIX_MOBILE + "Chrome"]],
			[/webview.+edge\/([\w\.]+)/i],
			[
				VERSION,
				[NAME, EDGE + " WebView"],
				[TYPE, INAPP]
			],
			[/edg(?:e|ios|a)?\/([\w\.]+)/i],
			[VERSION, [NAME, "Edge"]],
			[
				/(opera mini)\/([-\w\.]+)/i,
				/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
				/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
			],
			[NAME, VERSION],
			[/opios[\/ ]+([\w\.]+)/i],
			[VERSION, [NAME, OPERA + " Mini"]],
			[/\bop(?:rg)?x\/([\w\.]+)/i],
			[VERSION, [NAME, OPERA + " GX"]],
			[/\bopr\/([\w\.]+)/i],
			[VERSION, [NAME, OPERA]],
			[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],
			[VERSION, [NAME, "Baidu"]],
			[/\b(?:mxbrowser|mxios|myie2)\/?([-\w\.]*)\b/i],
			[VERSION, [NAME, "Maxthon"]],
			[
				/(kindle)\/([\w\.]+)/i,
				/(lunascape|maxthon|netfront|jasmine|blazer|sleipnir)[\/ ]?([\w\.]*)/i,
				/(avant|iemobile|slim(?:browser|boat|jet))[\/ ]?([\d\.]*)/i,
				/(?:ms|\()(ie) ([\w\.]+)/i,
				/(atlas|flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|qupzilla|falkon|rekonq|puffin|whale(?!.+naver)|qqbrowserlite|duckduckgo|klar|helio|(?=comodo_)?dragon|otter|dooble|(?:hi|lg |ovi|qute)browser|palemoon)\/v?([-\w\.]+)/i,
				/(brave)(?: chrome)?\/([\d\.]+)/i,
				/(aloha|heytap|ovi|115|surf|qwant)browser\/([\d\.]+)/i,
				/(qwant)(?:ios|mobile)\/([\d\.]+)/i,
				/(ecosia|weibo)(?:__| \w+@)([\d\.]+)/i
			],
			[NAME, VERSION],
			[/quark(?:pc)?\/([-\w\.]+)/i],
			[VERSION, [NAME, "Quark"]],
			[/\bddg\/([\w\.]+)/i],
			[VERSION, [NAME, "DuckDuckGo"]],
			[/(?:\buc? ?browser|(?:juc.+)ucweb| ucpc)[\/ ]?([\w\.]+)/i],
			[VERSION, [NAME, "UCBrowser"]],
			[
				/microm.+\bqbcore\/([\w\.]+)/i,
				/\bqbcore\/([\w\.]+).+microm/i,
				/micromessenger\/([\w\.]+)/i
			],
			[VERSION, [NAME, "WeChat"]],
			[/konqueror\/([\w\.]+)/i],
			[VERSION, [NAME, "Konqueror"]],
			[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
			[VERSION, [NAME, "IE"]],
			[/ya(?:search)?browser\/([\w\.]+)/i],
			[VERSION, [NAME, "Yandex"]],
			[/slbrowser\/([\w\.]+)/i],
			[VERSION, [NAME, "Smart " + LENOVO + SUFFIX_BROWSER]],
			[/(av(?:ast|g|ira))\/([\w\.]+)/i],
			[[
				NAME,
				/(.+)/,
				"$1 Secure" + SUFFIX_BROWSER
			], VERSION],
			[/norton\/([\w\.]+)/i],
			[VERSION, [NAME, "Norton Private" + SUFFIX_BROWSER]],
			[/\bfocus\/([\w\.]+)/i],
			[VERSION, [NAME, FIREFOX + " Focus"]],
			[/ mms\/([\w\.]+)$/i],
			[VERSION, [NAME, OPERA + " Neon"]],
			[/ opt\/([\w\.]+)$/i],
			[VERSION, [NAME, OPERA + " Touch"]],
			[/coc_coc\w+\/([\w\.]+)/i],
			[VERSION, [NAME, "Coc Coc"]],
			[/dolfin\/([\w\.]+)/i],
			[VERSION, [NAME, "Dolphin"]],
			[/coast\/([\w\.]+)/i],
			[VERSION, [NAME, OPERA + " Coast"]],
			[/miuibrowser\/([\w\.]+)/i],
			[VERSION, [NAME, "MIUI" + SUFFIX_BROWSER]],
			[/fxios\/([\w\.-]+)/i],
			[VERSION, [NAME, PREFIX_MOBILE + FIREFOX]],
			[/\bqihoobrowser\/?([\w\.]*)/i],
			[VERSION, [NAME, "360"]],
			[/\b(qq)\/([\w\.]+)/i],
			[[
				NAME,
				/(.+)/,
				"$1Browser"
			], VERSION],
			[/(oculus|sailfish|huawei|vivo|pico)browser\/([\w\.]+)/i],
			[[
				NAME,
				/(.+)/,
				"$1" + SUFFIX_BROWSER
			], VERSION],
			[/ HBPC\/([\w\.]+)/],
			[VERSION, [NAME, HUAWEI + SUFFIX_BROWSER]],
			[/samsungbrowser\/([\w\.]+)/i],
			[VERSION, [NAME, SAMSUNG + " Internet"]],
			[/metasr[\/ ]?([\d\.]+)/i],
			[VERSION, [NAME, SOGOU + " Explorer"]],
			[/(sogou)mo\w+\/([\d\.]+)/i],
			[[NAME, SOGOU + " Mobile"], VERSION],
			[
				/(electron)\/([\w\.]+) safari/i,
				/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
				/m?(qqbrowser|2345(?=browser|chrome|explorer))\w*[\/ ]?v?([\w\.]+)/i
			],
			[NAME, VERSION],
			[/(lbbrowser|luakit|rekonq|steam(?= (clie|tenf|gameo)))/i],
			[NAME],
			[/ome\/([\w\.]+).+(iron(?= saf)|360(?=[es]e$))/i],
			[VERSION, NAME],
			[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
			[
				[NAME, FACEBOOK],
				VERSION,
				[TYPE, INAPP]
			],
			[
				/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
				/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
				/(daum)apps[\/ ]([\w\.]+)/i,
				/safari (line)\/([\w\.]+)/i,
				/\b(line)\/([\w\.]+)\/iab/i,
				/(alipay)client\/([\w\.]+)/i,
				/(twitter)(?:and| f.+e\/([\w\.]+))/i,
				/(bing)(?:web|sapphire)\/([\w\.]+)/i,
				/(instagram|snapchat|klarna)[\/ ]([-\w\.]+)/i
			],
			[
				NAME,
				VERSION,
				[TYPE, INAPP]
			],
			[/\bgsa\/([\w\.]+) .*safari\//i],
			[
				VERSION,
				[NAME, "GSA"],
				[TYPE, INAPP]
			],
			[/(?:musical_ly|trill)(?:.+app_?version\/|_)([\w\.]+)/i],
			[
				VERSION,
				[NAME, "TikTok"],
				[TYPE, INAPP]
			],
			[/\[(linkedin)app\]/i],
			[NAME, [TYPE, INAPP]],
			[/(zalo(?:app)?)[\/\sa-z]*([\w\.-]+)/i],
			[
				[
					NAME,
					/(.+)/,
					"Zalo"
				],
				VERSION,
				[TYPE, INAPP]
			],
			[/(chromium)[\/ ]([-\w\.]+)/i],
			[NAME, VERSION],
			[/ome-(lighthouse)$/i],
			[NAME, [TYPE, FETCHER]],
			[/headlesschrome(?:\/([\w\.]+)| )/i],
			[VERSION, [NAME, CHROME + " Headless"]],
			[/wv\).+chrome\/([\w\.]+).+edgw\//i],
			[
				VERSION,
				[NAME, EDGE + " WebView2"],
				[TYPE, INAPP]
			],
			[/; wv\).+(chrome)\/([\w\.]+)/i],
			[
				[NAME, CHROME + " WebView"],
				VERSION,
				[TYPE, INAPP]
			],
			[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
			[VERSION, [NAME, "Android" + SUFFIX_BROWSER]],
			[/chrome\/([\w\.]+) mobile/i],
			[VERSION, [NAME, PREFIX_MOBILE + "Chrome"]],
			[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
			[NAME, VERSION],
			[/version\/([\w\.\,]+) .*mobile(?:\/\w+ | ?)safari/i],
			[VERSION, [NAME, PREFIX_MOBILE + "Safari"]],
			[/iphone .*mobile(?:\/\w+ | ?)safari/i],
			[[NAME, PREFIX_MOBILE + "Safari"]],
			[/version\/([\w\.\,]+) .*(safari)/i],
			[VERSION, NAME],
			[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
			[NAME, [VERSION, "1"]],
			[/(webkit|khtml)\/([\w\.]+)/i],
			[NAME, VERSION],
			[/(?:mobile|tablet);.*(firefox)\/([\w\.-]+)/i],
			[[NAME, PREFIX_MOBILE + FIREFOX], VERSION],
			[/(navigator|netscape\d?)\/([-\w\.]+)/i],
			[[NAME, "Netscape"], VERSION],
			[/(wolvic|librewolf)\/([\w\.]+)/i],
			[NAME, VERSION],
			[/mobile vr; rv:([\w\.]+)\).+firefox/i],
			[VERSION, [NAME, FIREFOX + " Reality"]],
			[
				/ekiohf.+(flow)\/([\w\.]+)/i,
				/(swiftfox)/i,
				/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror)[\/ ]?([\w\.\+]+)/i,
				/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|basilisk|waterfox)\/([-\w\.]+)$/i,
				/(firefox)\/([\w\.]+)/i,
				/(mozilla)\/([\w\.]+(?= .+rv\:.+gecko\/\d+)|[0-4][\w\.]+(?!.+compatible))/i,
				/(amaya|dillo|doris|icab|ladybird|lynx|mosaic|netsurf|obigo|polaris|w3m|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
				/\b(links) \(([\w\.]+)/i
			],
			[NAME, [
				VERSION,
				/_/g,
				"."
			]],
			[/(cobalt)\/([\w\.]+)/i],
			[NAME, [
				VERSION,
				/[^\d\.]+./,
				EMPTY
			]]
		],
		cpu: [
			[/\b((amd|x|x86[-_]?|wow|win)64)\b/i],
			[[ARCHITECTURE, "amd64"]],
			[/(ia32(?=;))/i, /\b((i[346]|x)86)(pc)?\b/i],
			[[ARCHITECTURE, "ia32"]],
			[/\b(aarch64|arm(v?[89]e?l?|_?64))\b/i],
			[[ARCHITECTURE, "arm64"]],
			[/\b(arm(v[67])?ht?n?[fl]p?)\b/i],
			[[ARCHITECTURE, "armhf"]],
			[/( (ce|mobile); ppc;|\/[\w\.]+arm\b)/i],
			[[ARCHITECTURE, "arm"]],
			[/ sun4\w[;\)]/i],
			[[ARCHITECTURE, "sparc"]],
			[
				/\b(avr32|ia64(?=;)|68k(?=\))|\barm(?=v([1-7]|[5-7]1)l?|;|eabi)|(irix|mips|sparc)(64)?\b|pa-risc)/i,
				/((ppc|powerpc)(64)?)( mac|;|\))/i,
				/(?:osf1|[freopnt]{3,4}bsd) (alpha)/i
			],
			[[
				ARCHITECTURE,
				/ower/,
				EMPTY,
				lowerize
			]],
			[/mc680.0/i],
			[[ARCHITECTURE, "68k"]],
			[/winnt.+\[axp/i],
			[[ARCHITECTURE, "alpha"]]
		],
		device: [
			[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],
			[
				MODEL,
				[VENDOR, SAMSUNG],
				[TYPE, TABLET]
			],
			[
				/\b((?:s[cgp]h|gt|sm)-(?![lr])\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
				/samsung[- ]((?!sm-[lr]|browser)[-\w]+)/i,
				/sec-(sgh\w+)/i
			],
			[
				MODEL,
				[VENDOR, SAMSUNG],
				[TYPE, MOBILE]
			],
			[/(?:\/|\()(ip(?:hone|od)[\w, ]*)[\/\);]/i],
			[
				MODEL,
				[VENDOR, APPLE],
				[TYPE, MOBILE]
			],
			[/\b(?:ios|apple\w+)\/.+[\(\/](ipad)/i, /\b(ipad)[\d,]*[;\] ].+(mac |i(pad)?)os/i],
			[
				MODEL,
				[VENDOR, APPLE],
				[TYPE, TABLET]
			],
			[/(macintosh);/i],
			[MODEL, [VENDOR, APPLE]],
			[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
			[
				MODEL,
				[VENDOR, SHARP],
				[TYPE, MOBILE]
			],
			[/\b((?:brt|eln|hey2?|gdi|jdn)-a?[lnw]09|(?:ag[rm]3?|jdn2|kob2)-a?[lw]0[09]hn)(?: bui|\)|;)/i],
			[
				MODEL,
				[VENDOR, HONOR],
				[TYPE, TABLET]
			],
			[/honor([-\w ]+)[;\)]/i],
			[
				MODEL,
				[VENDOR, HONOR],
				[TYPE, MOBILE]
			],
			[/\b((?:ag[rs][2356]?k?|bah[234]?|bg[2o]|bt[kv]|cmr|cpn|db[ry]2?|jdn2|got|kob2?k?|mon|pce|scm|sht?|[tw]gr|vrd)-[ad]?[lw][0125][09]b?|605hw|bg2-u03|(?:gem|fdr|m2|ple|t1)-[7a]0[1-4][lu]|t1-a2[13][lw]|mediapad[\w\. ]*(?= bui|\)))\b(?!.+d\/s)/i],
			[
				MODEL,
				[VENDOR, HUAWEI],
				[TYPE, TABLET]
			],
			[/(?:huawei) ?([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][\dc][adnt]?)\b(?!.+d\/s)/i],
			[
				MODEL,
				[VENDOR, HUAWEI],
				[TYPE, MOBILE]
			],
			[/oid[^\)]+; (2[\dbc]{4}(182|283|rp\w{2})[cgl]|m2105k81a?c)(?: bui|\))/i, /\b(?:xiao)?((?:red)?mi[-_ ]?pad[\w- ]*)(?: bui|\))/i],
			[
				[
					MODEL,
					/_/g,
					" "
				],
				[VENDOR, XIAOMI],
				[TYPE, TABLET]
			],
			[
				/\b; (\w+) build\/hm\1/i,
				/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
				/oid[^\)]+; (redmi[\-_ ]?(?:note|k)?[\w_ ]+|m?[12]\d[01]\d\w{3,6}|poco[\w ]+|(shark )?\w{3}-[ah]0|qin ?[1-3](s\+|ultra| pro)?)( bui|; wv|\))/i,
				/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note|max|cc)?[_ ]?(?:\d{0,2}\w?)[_ ]?(?:plus|se|lite|pro)?( 5g|lte)?)(?: bui|\))/i,
				/; ([\w ]+) miui\/v?\d/i
			],
			[
				[
					MODEL,
					/_/g,
					" "
				],
				[VENDOR, XIAOMI],
				[TYPE, MOBILE]
			],
			[/droid.+; (cph2[3-6]\d[13579]|((gm|hd)19|(ac|be|in|kb)20|(d[en]|eb|le|mt)21|ne22)[0-2]\d|p[g-l]\w[1m]10)\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],
			[
				MODEL,
				[VENDOR, ONEPLUS],
				[TYPE, MOBILE]
			],
			[/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],
			[
				MODEL,
				[VENDOR, OPPO],
				[TYPE, MOBILE]
			],
			[/\b(opd2(\d{3}a?))(?: bui|\))/i],
			[
				MODEL,
				[
					VENDOR,
					strMapper,
					{
						"OnePlus": [
							"203",
							"304",
							"403",
							"404",
							"413",
							"415"
						],
						"*": OPPO
					}
				],
				[TYPE, TABLET]
			],
			[/(vivo (5r?|6|8l?|go|one|s|x[il]?[2-4]?)[\w\+ ]*)(?: bui|\))/i],
			[
				MODEL,
				[VENDOR, "BLU"],
				[TYPE, MOBILE]
			],
			[/; vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
			[
				MODEL,
				[VENDOR, "Vivo"],
				[TYPE, MOBILE]
			],
			[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],
			[
				MODEL,
				[VENDOR, "Realme"],
				[TYPE, MOBILE]
			],
			[/(ideatab[-\w ]+|602lv|d-42a|a101lv|a2109a|a3500-hv|s[56]000|pb-6505[my]|tb-?x?\d{3,4}(?:f[cu]|xu|[av])|yt\d?-[jx]?\d+[lfmx])( bui|;|\)|\/)/i, /lenovo ?(b[68]0[08]0-?[hf]?|tab(?:[\w- ]+?)|tb[\w-]{6,7})( bui|;|\)|\/)/i],
			[
				MODEL,
				[VENDOR, LENOVO],
				[TYPE, TABLET]
			],
			[/lenovo[-_ ]?([-\w ]+?)(?: bui|\)|\/)/i],
			[
				MODEL,
				[VENDOR, LENOVO],
				[TYPE, MOBILE]
			],
			[
				/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
				/\bmot(?:orola)?[- ]([\w\s]+)(\)| bui)/i,
				/((?:moto(?! 360)[-\w\(\) ]+|xt\d{3,4}[cgkosw\+]?[-\d]*|nexus 6)(?= bui|\)))/i
			],
			[
				MODEL,
				[VENDOR, MOTOROLA],
				[TYPE, MOBILE]
			],
			[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
			[
				MODEL,
				[VENDOR, MOTOROLA],
				[TYPE, TABLET]
			],
			[/\b(?:lg)?([vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
			[
				MODEL,
				[VENDOR, LG],
				[TYPE, TABLET]
			],
			[
				/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
				/\blg[-e;\/ ]+(?!.*(?:browser|netcast|android tv|watch|webos))(\w+)/i,
				/\blg-?([\d\w]+) bui/i
			],
			[
				MODEL,
				[VENDOR, LG],
				[TYPE, MOBILE]
			],
			[/(nokia) (t[12][01])/i],
			[
				VENDOR,
				MODEL,
				[TYPE, TABLET]
			],
			[/(?:maemo|nokia).*(n900|lumia \d+|rm-\d+)/i, /nokia[-_ ]?(([-\w\. ]*?))( bui|\)|;|\/)/i],
			[
				[
					MODEL,
					/_/g,
					" "
				],
				[TYPE, MOBILE],
				[VENDOR, "Nokia"]
			],
			[/(pixel (c|tablet))\b/i],
			[
				MODEL,
				[VENDOR, GOOGLE],
				[TYPE, TABLET]
			],
			[/droid.+;(?: google)? (g(01[13]a|020[aem]|025[jn]|1b60|1f8f|2ybb|4s1m|576d|5nz6|8hhn|8vou|a02099|c15s|d1yq|e2ae|ec77|gh2x|kv4x|p4bc|pj41|r83y|tt9q|ur25|wvk6)|pixel[\d ]*a?( pro)?( xl)?( fold)?( \(5g\))?)( bui|\))/i],
			[
				MODEL,
				[VENDOR, GOOGLE],
				[TYPE, MOBILE]
			],
			[/(google) (pixelbook( go)?)/i],
			[VENDOR, MODEL],
			[/droid.+; (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-\w\w\d\d)(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],
			[
				MODEL,
				[VENDOR, SONY],
				[TYPE, MOBILE]
			],
			[/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
			[
				[MODEL, "Xperia Tablet"],
				[VENDOR, SONY],
				[TYPE, TABLET]
			],
			[
				/(alexa)webm/i,
				/(kf[a-z]{2}wi|aeo(?!bc)\w\w)( bui|\))/i,
				/(kf[a-z]+)( bui|\)).+silk\//i
			],
			[
				MODEL,
				[VENDOR, AMAZON],
				[TYPE, TABLET]
			],
			[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
			[
				[
					MODEL,
					/(.+)/g,
					"Fire Phone $1"
				],
				[VENDOR, AMAZON],
				[TYPE, MOBILE]
			],
			[/(playbook);[-\w\),; ]+(rim)/i],
			[
				MODEL,
				VENDOR,
				[TYPE, TABLET]
			],
			[/\b((?:bb[a-f]|st[hv])100-\d)/i, /(?:blackberry|\(bb10;) (\w+)/i],
			[
				MODEL,
				[VENDOR, BLACKBERRY],
				[TYPE, MOBILE]
			],
			[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],
			[
				MODEL,
				[VENDOR, ASUS],
				[TYPE, TABLET]
			],
			[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
			[
				MODEL,
				[VENDOR, ASUS],
				[TYPE, MOBILE]
			],
			[/(nexus 9)/i],
			[
				MODEL,
				[VENDOR, "HTC"],
				[TYPE, TABLET]
			],
			[
				/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
				/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
				/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
			],
			[
				VENDOR,
				[
					MODEL,
					/_/g,
					" "
				],
				[TYPE, MOBILE]
			],
			[/tcl (xess p17aa)/i, /droid [\w\.]+; ((?:8[14]9[16]|9(?:0(?:48|60|8[01])|1(?:3[27]|66)|2(?:6[69]|9[56])|466))[gqswx])(_\w(\w|\w\w))?(\)| bui)/i],
			[
				MODEL,
				[VENDOR, "TCL"],
				[TYPE, TABLET]
			],
			[/droid [\w\.]+; (418(?:7d|8v)|5087z|5102l|61(?:02[dh]|25[adfh]|27[ai]|56[dh]|59k|65[ah])|a509dl|t(?:43(?:0w|1[adepqu])|50(?:6d|7[adju])|6(?:09dl|10k|12b|71[efho]|76[hjk])|7(?:66[ahju]|67[hw]|7[045][bh]|71[hk]|73o|76[ho]|79w|81[hks]?|82h|90[bhsy]|99b)|810[hs]))(_\w(\w|\w\w))?(\)| bui)/i],
			[
				MODEL,
				[VENDOR, "TCL"],
				[TYPE, MOBILE]
			],
			[/(itel) ((\w+))/i],
			[
				[VENDOR, lowerize],
				MODEL,
				[
					TYPE,
					strMapper,
					{
						"tablet": ["p10001l", "w7001"],
						"*": "mobile"
					}
				]
			],
			[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
			[
				MODEL,
				[VENDOR, "Acer"],
				[TYPE, TABLET]
			],
			[/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
			[
				MODEL,
				[VENDOR, "Meizu"],
				[TYPE, MOBILE]
			],
			[/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],
			[
				MODEL,
				[VENDOR, "Ulefone"],
				[TYPE, MOBILE]
			],
			[/; (energy ?\w+)(?: bui|\))/i, /; energizer ([\w ]+)(?: bui|\))/i],
			[
				MODEL,
				[VENDOR, "Energizer"],
				[TYPE, MOBILE]
			],
			[/; cat (b35);/i, /; (b15q?|s22 flip|s48c|s62 pro)(?: bui|\))/i],
			[
				MODEL,
				[VENDOR, "Cat"],
				[TYPE, MOBILE]
			],
			[/((?:new )?andromax[\w- ]+)(?: bui|\))/i],
			[
				MODEL,
				[VENDOR, "Smartfren"],
				[TYPE, MOBILE]
			],
			[/droid.+; (a(in)?(0(15|59|6[35])|142)p?)/i],
			[
				MODEL,
				[VENDOR, "Nothing"],
				[TYPE, MOBILE]
			],
			[/; (x67 5g|tikeasy \w+|ac[1789]\d\w+)( b|\))/i, /archos ?(5|gamepad2?|([\w ]*[t1789]|hello) ?\d+[\w ]*)( b|\))/i],
			[
				MODEL,
				[VENDOR, "Archos"],
				[TYPE, TABLET]
			],
			[/archos ([\w ]+)( b|\))/i, /; (ac[3-6]\d\w{2,8})( b|\))/i],
			[
				MODEL,
				[VENDOR, "Archos"],
				[TYPE, MOBILE]
			],
			[/blackview ([-\w ]+)( b|\))/i, /; (bv\d{4}[-\w ]*)( b|\))/i],
			[
				MODEL,
				[VENDOR, "Blackview"],
				[TYPE, MOBILE]
			],
			[/; (n159v)/i],
			[
				MODEL,
				[VENDOR, "HMD"],
				[TYPE, MOBILE]
			],
			[/((revvl[ \w\+]+|tm(?:rv|af)\w*[45]g(?:tb)?))( b|\))/i],
			[
				MODEL,
				[
					TYPE,
					strTest,
					{
						"test": /ta?b/i,
						"ifTrue": TABLET,
						"ifFalse": MOBILE
					}
				],
				[VENDOR, "T-Mobile"]
			],
			[/(imo) (tab \w+)/i, /(infinix|tecno) (x1101b?|p904|dp(7c|8d|10a)( pro)?|p70[1-3]a?|p904|t1101)/i],
			[
				VENDOR,
				MODEL,
				[TYPE, TABLET]
			],
			[
				/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus(?! zenw)|dell|jolla|meizu|motorola|polytron|tecno|micromax|advan)[-_ ]?([-\w]*)/i,
				/; (blu|coolpad|cubot|hmd|imo|infinix|lava|oneplus|tcl|wiko)[_ ]([-\w\+ ]+?)(?: bui|\)|; r)/i,
				/(hp) ([\w ]+\w)/i,
				/(microsoft); (lumia[\w ]+)/i,
				/(oppo) ?([\w ]+) bui/i,
				/(hisense) ([ehv][\w ]+)\)/i,
				/droid[^;]+; (philips)[_ ]([sv-x][\d]{3,4}[xz]?)/i
			],
			[
				VENDOR,
				MODEL,
				[TYPE, MOBILE]
			],
			[
				/(kobo)\s(ereader|touch)/i,
				/(hp).+(touchpad(?!.+tablet)|tablet)/i,
				/(kindle)\/([\w\.]+)/i
			],
			[
				VENDOR,
				MODEL,
				[TYPE, TABLET]
			],
			[/(surface duo)/i],
			[
				MODEL,
				[VENDOR, MICROSOFT],
				[TYPE, TABLET]
			],
			[/droid [\d\.]+; (fp\du?)(?: b|\))/i],
			[
				MODEL,
				[VENDOR, "Fairphone"],
				[TYPE, MOBILE]
			],
			[/((?:tegranote|shield t(?!.+d tv))[\w- ]*?)(?: b|\))/i],
			[
				MODEL,
				[VENDOR, NVIDIA],
				[TYPE, TABLET]
			],
			[/(sprint) (\w+)/i],
			[
				VENDOR,
				MODEL,
				[TYPE, MOBILE]
			],
			[/(kin\.[onetw]{3})/i],
			[
				[
					MODEL,
					/\./g,
					" "
				],
				[VENDOR, MICROSOFT],
				[TYPE, MOBILE]
			],
			[/droid.+; ([c6]+|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
			[
				MODEL,
				[VENDOR, ZEBRA],
				[TYPE, TABLET]
			],
			[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
			[
				MODEL,
				[VENDOR, ZEBRA],
				[TYPE, MOBILE]
			],
			[/(philips)[\w ]+tv/i, /smart-tv.+(samsung)/i],
			[VENDOR, [TYPE, SMARTTV]],
			[/hbbtv.+maple;(\d+)/i],
			[
				[
					MODEL,
					/^/,
					"SmartTV"
				],
				[VENDOR, SAMSUNG],
				[TYPE, SMARTTV]
			],
			[/(vizio)(?: |.+model\/)(\w+-\w+)/i, /tcast.+(lg)e?. ([-\w]+)/i],
			[
				VENDOR,
				MODEL,
				[TYPE, SMARTTV]
			],
			[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
			[[VENDOR, LG], [TYPE, SMARTTV]],
			[/(apple) ?tv/i],
			[
				VENDOR,
				[MODEL, APPLE + " TV"],
				[TYPE, SMARTTV]
			],
			[/crkey.*devicetype\/chromecast/i],
			[
				[MODEL, CHROMECAST + " Third Generation"],
				[VENDOR, GOOGLE],
				[TYPE, SMARTTV]
			],
			[/crkey.*devicetype\/([^/]*)/i],
			[
				[
					MODEL,
					/^/,
					"Chromecast "
				],
				[VENDOR, GOOGLE],
				[TYPE, SMARTTV]
			],
			[/fuchsia.*crkey/i],
			[
				[MODEL, CHROMECAST + " Nest Hub"],
				[VENDOR, GOOGLE],
				[TYPE, SMARTTV]
			],
			[/crkey/i],
			[
				[MODEL, CHROMECAST],
				[VENDOR, GOOGLE],
				[TYPE, SMARTTV]
			],
			[/(portaltv)/i],
			[
				MODEL,
				[VENDOR, FACEBOOK],
				[TYPE, SMARTTV]
			],
			[/droid.+aft(\w+)( bui|\))/i],
			[
				MODEL,
				[VENDOR, AMAZON],
				[TYPE, SMARTTV]
			],
			[/(shield \w+ tv)/i],
			[
				MODEL,
				[VENDOR, NVIDIA],
				[TYPE, SMARTTV]
			],
			[/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i],
			[
				MODEL,
				[VENDOR, SHARP],
				[TYPE, SMARTTV]
			],
			[/(bravia[\w ]+)( bui|\))/i],
			[
				MODEL,
				[VENDOR, SONY],
				[TYPE, SMARTTV]
			],
			[/(mi(tv|box)-?\w+) bui/i],
			[
				MODEL,
				[VENDOR, XIAOMI],
				[TYPE, SMARTTV]
			],
			[/Hbbtv.*(technisat) (.*);/i],
			[
				VENDOR,
				MODEL,
				[TYPE, SMARTTV]
			],
			[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],
			[
				[
					VENDOR,
					/.+\/(\w+)/,
					"$1",
					strMapper,
					{ "LG": "lge" }
				],
				[MODEL, trim],
				[TYPE, SMARTTV]
			],
			[/(playstation \w+)/i],
			[
				MODEL,
				[VENDOR, SONY],
				[TYPE, CONSOLE]
			],
			[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
			[
				MODEL,
				[VENDOR, MICROSOFT],
				[TYPE, CONSOLE]
			],
			[
				/(ouya)/i,
				/(nintendo) (\w+)/i,
				/(retroid) (pocket ([^\)]+))/i,
				/(valve).+(steam deck)/i,
				/droid.+; ((shield|rgcube|gr0006))( bui|\))/i
			],
			[
				[
					VENDOR,
					strMapper,
					{
						"Nvidia": "Shield",
						"Anbernic": "RGCUBE",
						"Logitech": "GR0006"
					}
				],
				MODEL,
				[TYPE, CONSOLE]
			],
			[/\b(sm-[lr]\d\d[0156][fnuw]?s?|gear live)\b/i],
			[
				MODEL,
				[VENDOR, SAMSUNG],
				[TYPE, WEARABLE]
			],
			[/((pebble))app/i, /(asus|google|lg|oppo|xiaomi) ((pixel |zen)?watch[\w ]*)( bui|\))/i],
			[
				VENDOR,
				MODEL,
				[TYPE, WEARABLE]
			],
			[/(ow(?:19|20)?we?[1-3]{1,3})/i],
			[
				MODEL,
				[VENDOR, OPPO],
				[TYPE, WEARABLE]
			],
			[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],
			[
				MODEL,
				[VENDOR, APPLE],
				[TYPE, WEARABLE]
			],
			[/(opwwe\d{3})/i],
			[
				MODEL,
				[VENDOR, ONEPLUS],
				[TYPE, WEARABLE]
			],
			[/(moto 360)/i],
			[
				MODEL,
				[VENDOR, MOTOROLA],
				[TYPE, WEARABLE]
			],
			[/(smartwatch 3)/i],
			[
				MODEL,
				[VENDOR, SONY],
				[TYPE, WEARABLE]
			],
			[/(g watch r)/i],
			[
				MODEL,
				[VENDOR, LG],
				[TYPE, WEARABLE]
			],
			[/droid.+; (wt63?0{2,3})\)/i],
			[
				MODEL,
				[VENDOR, ZEBRA],
				[TYPE, WEARABLE]
			],
			[/droid.+; (glass) \d/i],
			[
				MODEL,
				[VENDOR, GOOGLE],
				[TYPE, XR]
			],
			[/(pico) ([\w ]+) os\d/i],
			[
				VENDOR,
				MODEL,
				[TYPE, XR]
			],
			[/(quest( \d| pro)?s?).+vr/i],
			[
				MODEL,
				[VENDOR, FACEBOOK],
				[TYPE, XR]
			],
			[/mobile vr; rv.+firefox/i],
			[[TYPE, XR]],
			[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
			[VENDOR, [TYPE, EMBEDDED]],
			[/(aeobc)\b/i],
			[
				MODEL,
				[VENDOR, AMAZON],
				[TYPE, EMBEDDED]
			],
			[/(homepod).+mac os/i],
			[
				MODEL,
				[VENDOR, APPLE],
				[TYPE, EMBEDDED]
			],
			[/windows iot/i],
			[[TYPE, EMBEDDED]],
			[/droid.+; ([\w- ]+) (4k|android|smart|google)[- ]?tv/i],
			[MODEL, [TYPE, SMARTTV]],
			[/\b((4k|android|smart|opera)[- ]?tv|tv; rv:|large screen[\w ]+safari)\b/i],
			[[TYPE, SMARTTV]],
			[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew|; hmsc).+?(mobile|vr|\d) safari/i],
			[MODEL, [
				TYPE,
				strMapper,
				{
					"mobile": "Mobile",
					"xr": "VR",
					"*": TABLET
				}
			]],
			[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
			[[TYPE, TABLET]],
			[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],
			[[TYPE, MOBILE]],
			[/droid .+?; ([\w\. -]+)( bui|\))/i],
			[MODEL, [VENDOR, "Generic"]]
		],
		engine: [
			[/windows.+ edge\/([\w\.]+)/i],
			[VERSION, [NAME, EDGE + "HTML"]],
			[/(arkweb)\/([\w\.]+)/i],
			[NAME, VERSION],
			[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
			[VERSION, [NAME, "Blink"]],
			[
				/(presto)\/([\w\.]+)/i,
				/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna|servo)\/([\w\.]+)/i,
				/ekioh(flow)\/([\w\.]+)/i,
				/(khtml|tasman|links|dillo)[\/ ]\(?([\w\.]+)/i,
				/(icab)[\/ ]([23]\.[\d\.]+)/i,
				/\b(libweb)/i
			],
			[NAME, VERSION],
			[/ladybird\//i],
			[[NAME, "LibWeb"]],
			[/rv\:([\w\.]{1,9})\b.+(gecko)/i],
			[VERSION, NAME]
		],
		os: [
			[/(windows nt) (6\.[23]); arm/i],
			[[
				NAME,
				/N/,
				"R"
			], [
				VERSION,
				strMapper,
				windowsVersionMap
			]],
			[/(windows (?:phone|mobile|iot))(?: os)?[\/ ]?([\d\.]*( se)?)/i, /(windows)[\/ ](1[01]|2000|3\.1|7|8(\.1)?|9[58]|me|server 20\d\d( r2)?|vista|xp)/i],
			[NAME, VERSION],
			[/windows nt ?([\d\.\)]*)(?!.+xbox)/i, /\bwin(?=3| ?9|n)(?:nt| 9x )?([\d\.;]*)/i],
			[[
				VERSION,
				/(;|\))/g,
				"",
				strMapper,
				windowsVersionMap
			], [NAME, WINDOWS]],
			[/(windows ce)\/?([\d\.]*)/i],
			[NAME, VERSION],
			[
				/[adehimnop]{4,7}\b(?:.*os ([\w]+) like mac|; opera)/i,
				/(?:ios;fbsv|ios(?=.+ip(?:ad|hone)|.+apple ?tv)|ip(?:ad|hone)(?: |.+i(?:pad)?)os|apple ?tv.+ios)[\/ ]([\w\.]+)/i,
				/\btvos ?([\w\.]+)/i,
				/cfnetwork\/.+darwin/i
			],
			[[
				VERSION,
				/_/g,
				"."
			], [NAME, "iOS"]],
			[/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+(haiku|morphos))/i],
			[[NAME, "macOS"], [
				VERSION,
				/_/g,
				"."
			]],
			[/android ([\d\.]+).*crkey/i],
			[VERSION, [NAME, CHROMECAST + " Android"]],
			[/fuchsia.*crkey\/([\d\.]+)/i],
			[VERSION, [NAME, CHROMECAST + " Fuchsia"]],
			[/crkey\/([\d\.]+).*devicetype\/smartspeaker/i],
			[VERSION, [NAME, CHROMECAST + " SmartSpeaker"]],
			[/linux.*crkey\/([\d\.]+)/i],
			[VERSION, [NAME, CHROMECAST + " Linux"]],
			[/crkey\/([\d\.]+)/i],
			[VERSION, [NAME, CHROMECAST]],
			[/droid ([\w\.]+)\b.+(android[- ]x86)/i],
			[VERSION, NAME],
			[/(ubuntu) ([\w\.]+) like android/i],
			[[
				NAME,
				/(.+)/,
				"$1 Touch"
			], VERSION],
			[/(harmonyos)[\/ ]?([\d\.]*)/i, /(android|bada|blackberry|kaios|maemo|meego|openharmony|qnx|rim tablet os|sailfish|series40|symbian|tizen)\w*[-\/\.; ]?([\d\.]*)/i],
			[NAME, VERSION],
			[/\(bb(10);/i],
			[VERSION, [NAME, BLACKBERRY]],
			[/(?:symbian ?os|symbos|s60(?=;)|series ?60)[-\/ ]?([\w\.]*)/i],
			[VERSION, [NAME, "Symbian"]],
			[/mozilla\/[\d\.]+ \((?:mobile[;\w ]*|tablet|tv|[^\)]*(?:viera|lg(?:l25|-d300)|alcatel ?o.+|y300-f1)); rv:([\w\.]+)\).+gecko\//i],
			[VERSION, [NAME, FIREFOX + " OS"]],
			[/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i, /webos(?:[ \/]?|\.tv-20(?=2[2-9]))(\d[\d\.]*)/i],
			[VERSION, [NAME, "webOS"]],
			[/web0s;.+?(?:chr[o0]me|safari)\/(\d+)/i],
			[[
				VERSION,
				strMapper,
				{
					"25": "120",
					"24": "108",
					"23": "94",
					"22": "87",
					"6": "79",
					"5": "68",
					"4": "53",
					"3": "38",
					"2": "538",
					"1": "537",
					"*": "TV"
				}
			], [NAME, "webOS"]],
			[/watch(?: ?os[,\/ ]|\d,\d\/)([\d\.]+)/i],
			[VERSION, [NAME, "watchOS"]],
			[/cros [\w]+(?:\)| ([\w\.]+)\b)/i],
			[VERSION, [NAME, "Chrome OS"]],
			[/kepler ([\w\.]+); (aft|aeo)/i],
			[VERSION, [NAME, "Vega OS"]],
			[
				/(netrange)mmh/i,
				/(nettv)\/(\d+\.[\w\.]+)/i,
				/(nintendo|playstation) (\w+)/i,
				/(xbox); +xbox ([^\);]+)/i,
				/(pico) .+os([\w\.]+)/i,
				/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
				/linux.+(mint)[\/\(\) ]?([\w\.]*)/i,
				/(mageia|vectorlinux|fuchsia|arcaos|arch(?= ?linux))[;l ]([\d\.]*)/i,
				/([kxln]?ubuntu|debian|suse|opensuse|gentoo|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire|knoppix)(?: gnu[\/ ]linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
				/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
				/\b(aix)[; ]([1-9\.]{0,4})/i,
				/(hurd|linux|morphos)(?: (?:arm|x86|ppc)\w*| ?)([\w\.]*)/i,
				/(gnu) ?([\w\.]*)/i,
				/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
				/(haiku) ?(r\d)?/i
			],
			[NAME, VERSION],
			[/(sunos) ?([\d\.]*)/i],
			[[NAME, "Solaris"], VERSION],
			[/\b(beos|os\/2|amigaos|openvms|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i],
			[NAME, VERSION]
		]
	};
	var defaultProps = (function() {
		var props = {
			init: {},
			isIgnore: {},
			isIgnoreRgx: {},
			toString: {}
		};
		setProps.call(props.init, [
			[BROWSER, [
				NAME,
				VERSION,
				MAJOR,
				TYPE
			]],
			[CPU, [ARCHITECTURE]],
			[DEVICE, [
				TYPE,
				MODEL,
				VENDOR
			]],
			[ENGINE, [NAME, VERSION]],
			[OS, [NAME, VERSION]]
		]);
		setProps.call(props.isIgnore, [
			[BROWSER, [VERSION, MAJOR]],
			[ENGINE, [VERSION]],
			[OS, [VERSION]]
		]);
		setProps.call(props.isIgnoreRgx, [[BROWSER, / ?browser$/i], [OS, / ?os$/i]]);
		setProps.call(props.toString, [
			[BROWSER, [NAME, VERSION]],
			[CPU, [ARCHITECTURE]],
			[DEVICE, [VENDOR, MODEL]],
			[ENGINE, [NAME, VERSION]],
			[OS, [NAME, VERSION]]
		]);
		return props;
	})();
	var createIData = function(item, itemType) {
		var init_props = defaultProps.init[itemType], is_ignoreProps = defaultProps.isIgnore[itemType] || 0, is_ignoreRgx = defaultProps.isIgnoreRgx[itemType] || 0, toString_props = defaultProps.toString[itemType] || 0;
		function IData() {
			setProps.call(this, init_props);
		}
		IData.prototype.getItem = function() {
			return item;
		};
		IData.prototype.withClientHints = function() {
			if (!NAVIGATOR_UADATA) return item.parseCH().get();
			return NAVIGATOR_UADATA.getHighEntropyValues(CH_ALL_VALUES).then(function(res) {
				return item.setCH(new UACHData(res, false)).parseCH().get();
			});
		};
		IData.prototype.withFeatureCheck = function() {
			return item.detectFeature().get();
		};
		if (itemType != RESULT) {
			IData.prototype.is = function(strToCheck) {
				var is = false;
				for (var i in this) if (this.hasOwnProperty(i) && !has(is_ignoreProps, i) && lowerize(is_ignoreRgx ? strip(is_ignoreRgx, this[i]) : this[i]) == lowerize(is_ignoreRgx ? strip(is_ignoreRgx, strToCheck) : strToCheck)) {
					is = true;
					if (strToCheck != TYPEOF.UNDEFINED) break;
				} else if (strToCheck == TYPEOF.UNDEFINED && is) {
					is = !is;
					break;
				}
				return is;
			};
			IData.prototype.toString = function() {
				var str = EMPTY;
				for (var i in toString_props) if (typeof this[toString_props[i]] !== TYPEOF.UNDEFINED) str += (str ? " " : EMPTY) + this[toString_props[i]];
				return str || TYPEOF.UNDEFINED;
			};
		}
		IData.prototype.then = function(cb) {
			var that = this;
			var IDataResolve = function() {
				for (var prop in that) if (that.hasOwnProperty(prop)) this[prop] = that[prop];
			};
			IDataResolve.prototype = {
				is: IData.prototype.is,
				toString: IData.prototype.toString,
				withClientHints: IData.prototype.withClientHints,
				withFeatureCheck: IData.prototype.withFeatureCheck
			};
			var resolveData = new IDataResolve();
			cb(resolveData);
			return resolveData;
		};
		return new IData();
	};
	function UACHData(uach, isHttpUACH) {
		uach = uach || {};
		setProps.call(this, CH_ALL_VALUES);
		if (isHttpUACH) setProps.call(this, [
			[BRANDS, itemListToArray(uach[CH])],
			[FULLVERLIST, itemListToArray(uach[CH_FULL_VER_LIST])],
			[MOBILE, /\?1/.test(uach[CH_MOBILE])],
			[MODEL, normalizeHeaderValue(uach[CH_MODEL])],
			[PLATFORM, normalizeHeaderValue(uach[CH_PLATFORM])],
			[PLATFORMVER, normalizeHeaderValue(uach[CH_PLATFORM_VER])],
			[ARCHITECTURE, normalizeHeaderValue(uach[CH_ARCH])],
			[FORMFACTORS, itemListToArray(uach[CH_FORM_FACTORS])],
			[BITNESS, normalizeHeaderValue(uach[CH_BITNESS])]
		]);
		else for (var prop in uach) if (this.hasOwnProperty(prop) && typeof uach[prop] !== TYPEOF.UNDEFINED) this[prop] = uach[prop];
	}
	function UAItem(itemType, ua, rgxMap, uaCH) {
		setProps.call(this, [
			["itemType", itemType],
			["ua", ua],
			["uaCH", uaCH],
			["rgxMap", rgxMap],
			["data", createIData(this, itemType)]
		]);
		return this;
	}
	UAItem.prototype.get = function(prop) {
		if (!prop) return this.data;
		return this.data.hasOwnProperty(prop) ? this.data[prop] : void 0;
	};
	UAItem.prototype.set = function(prop, val) {
		this.data[prop] = val;
		return this;
	};
	UAItem.prototype.setCH = function(ch) {
		this.uaCH = ch;
		return this;
	};
	UAItem.prototype.detectFeature = function() {
		if (NAVIGATOR && NAVIGATOR.userAgent == this.ua) switch (this.itemType) {
			case BROWSER:
				if (NAVIGATOR.brave && typeof NAVIGATOR.brave.isBrave == TYPEOF.FUNCTION) this.set(NAME, "Brave");
				break;
			case DEVICE:
				if (!this.get(TYPE) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[MOBILE]) this.set(TYPE, MOBILE);
				if (this.get(MODEL) == "Macintosh" && NAVIGATOR && typeof NAVIGATOR.standalone !== TYPEOF.UNDEFINED && NAVIGATOR.maxTouchPoints && NAVIGATOR.maxTouchPoints > 2) this.set(MODEL, "iPad").set(TYPE, TABLET);
				break;
			case OS:
				if (!this.get(NAME) && NAVIGATOR_UADATA && NAVIGATOR_UADATA[PLATFORM]) this.set(NAME, NAVIGATOR_UADATA[PLATFORM]);
				break;
			case RESULT:
				var data = this.data;
				var detect = function(itemType) {
					return data[itemType].getItem().detectFeature().get();
				};
				this.set(BROWSER, detect(BROWSER)).set(CPU, detect(CPU)).set(DEVICE, detect(DEVICE)).set(ENGINE, detect(ENGINE)).set(OS, detect(OS));
		}
		return this;
	};
	UAItem.prototype.parseUA = function() {
		if (this.itemType != RESULT) rgxMapper.call(this.data, this.ua, this.rgxMap);
		switch (this.itemType) {
			case BROWSER:
				this.set(MAJOR, majorize(this.get(VERSION)));
				break;
			case OS:
				if (this.get(NAME) == "iOS" && this.get(VERSION)) {
					if (/^1[89][^\d]/.exec(this.get(VERSION))) {
						var realVersion = /\) Version\/((\d+)[\d\.]*)/.exec(this.ua);
						if (realVersion && parseInt(realVersion[2], 10) >= 26) this.set(VERSION, realVersion[1]);
					}
				}
				break;
		}
		return this;
	};
	UAItem.prototype.parseCH = function() {
		var uaCH = this.uaCH, rgxMap = this.rgxMap;
		switch (this.itemType) {
			case BROWSER:
			case ENGINE:
				var brands = uaCH[FULLVERLIST] || uaCH[BRANDS], prevName;
				if (brands) for (var i = 0; i < brands.length; i++) {
					var brandName = brands[i].brand || brands[i], brandVersion = brands[i].version;
					if (this.itemType == BROWSER && !/not.a.brand/i.test(brandName) && (!prevName || /Chrom/.test(prevName) && brandName != CHROMIUM || prevName == EDGE && /WebView2/.test(brandName))) {
						brandName = strMapper(brandName, browserHintsMap);
						prevName = this.get(NAME);
						if (!(prevName && !/Chrom/.test(prevName) && /Chrom/.test(brandName))) this.set(NAME, brandName).set(VERSION, brandVersion).set(MAJOR, majorize(brandVersion));
						prevName = brandName;
					}
					if (this.itemType == ENGINE && brandName == CHROMIUM) this.set(VERSION, brandVersion);
				}
				break;
			case CPU:
				var archName = uaCH[ARCHITECTURE];
				if (archName) {
					if (archName && uaCH[BITNESS] == "64") archName += "64";
					rgxMapper.call(this.data, archName + ";", rgxMap);
				}
				break;
			case DEVICE:
				if (uaCH[MOBILE]) this.set(TYPE, MOBILE);
				if (uaCH[MODEL]) {
					this.set(MODEL, uaCH[MODEL]);
					if (!this.get(TYPE) || !this.get(VENDOR)) {
						var reParse = {};
						rgxMapper.call(reParse, "droid 9; " + uaCH[MODEL] + ")", rgxMap);
						if (!this.get(TYPE) && !!reParse.type) this.set(TYPE, reParse.type);
						if (!this.get(VENDOR) && !!reParse.vendor) this.set(VENDOR, reParse.vendor);
					}
				}
				if (uaCH[FORMFACTORS]) {
					var ff;
					if (typeof uaCH[FORMFACTORS] !== "string") {
						var idx = 0;
						while (!ff && idx < uaCH[FORMFACTORS].length) ff = strMapper(uaCH[FORMFACTORS][idx++], formFactorsMap);
					} else ff = strMapper(uaCH[FORMFACTORS], formFactorsMap);
					this.set(TYPE, ff);
				}
				break;
			case OS:
				var osName = uaCH[PLATFORM];
				if (osName) {
					var osVersion = uaCH[PLATFORMVER];
					if (osName == WINDOWS) osVersion = parseInt(majorize(osVersion), 10) >= 13 ? "11" : "10";
					this.set(NAME, osName).set(VERSION, osVersion);
				}
				if (this.get(NAME) == WINDOWS && uaCH[MODEL] == "Xbox") this.set(NAME, "Xbox").set(VERSION, void 0);
				break;
			case RESULT:
				var data = this.data;
				var parse = function(itemType) {
					return data[itemType].getItem().setCH(uaCH).parseCH().get();
				};
				this.set(BROWSER, parse(BROWSER)).set(CPU, parse(CPU)).set(DEVICE, parse(DEVICE)).set(ENGINE, parse(ENGINE)).set(OS, parse(OS));
		}
		return this;
	};
	function UAParser(ua, extensions, headers) {
		if (typeof ua === TYPEOF.OBJECT) {
			if (isExtensions(ua, true)) {
				if (typeof extensions === TYPEOF.OBJECT) headers = extensions;
				extensions = ua;
			} else {
				headers = ua;
				extensions = void 0;
			}
			ua = void 0;
		} else if (typeof ua === TYPEOF.STRING && !isExtensions(extensions, true)) {
			headers = extensions;
			extensions = void 0;
		}
		if (headers) if (typeof headers.append === TYPEOF.FUNCTION) {
			var kv = {};
			headers.forEach(function(v, k) {
				kv[String(k).toLowerCase()] = v;
			});
			headers = kv;
		} else {
			var normalized = {};
			for (var header in headers) if (headers.hasOwnProperty(header)) normalized[String(header).toLowerCase()] = headers[header];
			headers = normalized;
		}
		if (!(this instanceof UAParser)) return new UAParser(ua, extensions, headers).getResult();
		var userAgent = typeof ua === TYPEOF.STRING ? ua : headers && headers[USER_AGENT] ? headers[USER_AGENT] : NAVIGATOR && NAVIGATOR.userAgent ? NAVIGATOR.userAgent : EMPTY, httpUACH = new UACHData(headers, true), regexMap = defaultRegexes, createItemFunc = function(itemType) {
			if (itemType == RESULT) return function() {
				return new UAItem(itemType, userAgent, regexMap, httpUACH).set("ua", userAgent).set(BROWSER, this.getBrowser()).set(CPU, this.getCPU()).set(DEVICE, this.getDevice()).set(ENGINE, this.getEngine()).set(OS, this.getOS()).get();
			};
			else return function() {
				return new UAItem(itemType, userAgent, regexMap[itemType], httpUACH).parseUA().get();
			};
		};
		setProps.call(this, [
			["getBrowser", createItemFunc(BROWSER)],
			["getCPU", createItemFunc(CPU)],
			["getDevice", createItemFunc(DEVICE)],
			["getEngine", createItemFunc(ENGINE)],
			["getOS", createItemFunc(OS)],
			["getResult", createItemFunc(RESULT)],
			["getUA", function() {
				return userAgent;
			}],
			["setUA", function(ua) {
				if (isString(ua)) userAgent = trim(ua, UA_MAX_LENGTH);
				return this;
			}],
			["useExtension", function(exts) {
				if (exts) regexMap = extend(regexMap, exts);
				return this;
			}]
		]).setUA(userAgent).useExtension(extensions);
		return this;
	}
	UAParser.VERSION = LIBVERSION;
	UAParser.BROWSER = enumerize([
		NAME,
		VERSION,
		MAJOR,
		TYPE
	]);
	UAParser.CPU = enumerize([ARCHITECTURE]);
	UAParser.DEVICE = enumerize([
		MODEL,
		VENDOR,
		TYPE,
		CONSOLE,
		MOBILE,
		SMARTTV,
		TABLET,
		WEARABLE,
		EMBEDDED
	]);
	UAParser.ENGINE = UAParser.OS = enumerize([NAME, VERSION]);
	//#endregion
	//#region src/collectEntry.js
	var IPIFY = "https://api.ipify.org?format=json";
	var IPAPI = (ip) => `https://ipapi.co/${ip}/json`;
	var IPGEO = "https://api.ipgeolocation.io/ipgeo?apiKey=ceb5539b1a8e4670868cf6a0e0ff4509";
	/** fetch().json() that resolves to {} instead of throwing. */
	async function tryJson(url) {
		try {
			const res = await fetch(url);
			if (!res.ok) return {};
			return await res.json();
		} catch {
			return {};
		}
	}
	/** Battery percentage, or "blocked" where the browser refuses. */
	async function readBattery() {
		if (!navigator.getBattery) return "blocked";
		try {
			const b = await navigator.getBattery();
			return `${Math.round(100 * b.level)}%${b.charging ? " (charging)" : ""}`;
		} catch {
			return "blocked";
		}
	}
	/**
	* @param {(payload: object) => void} send called once with the entry payload
	*/
	async function collectEntry(send) {
		const ua = new UAParser().getResult();
		const { ip } = await tryJson(IPIFY);
		const [geo, whoda] = await Promise.all([ip ? tryJson(IPAPI(ip)) : Promise.resolve({}), tryJson(IPGEO)]);
		send({
			type: "entry",
			ip: ip || "unknown",
			os: `${ua.os.name} ${ua.os.version}`,
			browser: `${ua.browser.name} ${ua.browser.version}`,
			isp: whoda.isp || "unknown",
			location: geo.city && geo.country ? `${geo.city}, ${geo.country}` : "unknown",
			device: [ua.device.vendor, ua.device.model].filter(Boolean).join(" "),
			battery: await readBattery(),
			darkMode: window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light"
		});
	}
	//#endregion
	//#region src/App.svelte
	var root = /* @__PURE__ */ from_html(`<div class="noactive svelte-1n46o8q">Waiting for game start...</div>`);
	var root_1 = /* @__PURE__ */ from_html(`<div class="noactive svelte-1n46o8q"><button class="button-p svelte-1n46o8q">Start Game</button></div>`);
	var root_2 = /* @__PURE__ */ from_html(`<div class="noactive svelte-1n46o8q">Waiting for opponent's turn...</div>`);
	var root_3 = /* @__PURE__ */ from_html(`<button class="button-p svelte-1n46o8q" style="font-size: 0.7em; margin-top: 15px;">Clear Info</button> <!>`, 1);
	var root_4 = /* @__PURE__ */ from_html(`<button class="button-p svelte-1n46o8q" style="font-size: 0.7em; margin-top: 15px;">Show Info</button>`);
	var root_5 = /* @__PURE__ */ from_html(`<div class="noactive svelte-1n46o8q" style="flex-direction: column"> <button class="button-p svelte-1n46o8q" style="font-size: 0.7em; margin-top: 15px;">Restart</button> <!></div>`);
	var root_6 = /* @__PURE__ */ from_html(`<div class="noactive svelte-1n46o8q"> </div>`);
	var root_7 = /* @__PURE__ */ from_html(`<div class="bc svelte-1n46o8q"><button class="button-w lb svelte-1n46o8q">X Wins</button> <button class="button-w mb svelte-1n46o8q">O Wins</button> <button class="button-w rb svelte-1n46o8q">Stalemate</button></div>`);
	var root_8 = /* @__PURE__ */ from_html(`<!> <!> <!> <!> <div class="board svelte-1n46o8q"></div> <!>`, 1);
	var root_9 = /* @__PURE__ */ from_html(`<p>Connecting...</p>`);
	var root_10 = /* @__PURE__ */ from_html(`<main class="svelte-1n46o8q"><!> <!></main>`);
	function App($$anchor, $$props) {
		push($$props, true);
		console.table(document);
		let board = /* @__PURE__ */ state(proxy([
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			},
			{
				votes: 0,
				state: ""
			}
		]));
		let entries = /* @__PURE__ */ state(proxy({}));
		let showEntries = /* @__PURE__ */ state(false);
		let connected = /* @__PURE__ */ state(false);
		let time = /* @__PURE__ */ state(0);
		let gameActive = /* @__PURE__ */ state(false);
		let collectiveTurn = /* @__PURE__ */ state(true);
		let ending = /* @__PURE__ */ state("");
		let socket;
		const admin = window.location.hash == "#admin";
		const totalVotes = /* @__PURE__ */ user_derived(() => get(board).map((x) => x.votes).reduce((a, b) => a + b, 0));
		const resultText = /* @__PURE__ */ user_derived(() => get(ending) == "x" ? "X's win!" : get(ending) == "o" ? "O's win!" : "Stalemate!");
		const send = (payload) => socket.send(JSON.stringify(payload));
		const startGame = () => {
			if (admin) send({ type: "start" });
		};
		const socketLoad = (sock) => {
			socket = sock;
			console.log("Socket loaded!");
			collectEntry((payload) => sock.send(JSON.stringify(payload)));
			sock.on("error", () => {
				console.log("error");
				set(connected, false);
			});
			sock.on("message", (res) => {
				console.log(res);
				if (res.type == "board") set(board, res.board, true);
				if (res.type == "status") set(gameActive, res.gameActive, true);
				if (res.type == "time") set(time, res.time, true);
				if (res.type == "turn") set(collectiveTurn, res.collectiveTurn, true);
				if (res.type == "ending") set(ending, res.ending, true);
				if (res.type == "entries" && admin) set(entries, res.entries, true);
			});
		};
		const onTileVote = (i) => {
			if (!admin) {
				send({
					type: "vote",
					tile: i
				});
				get(board)[i].votes++;
			}
			if (admin && !get(collectiveTurn)) send({
				type: "admin_vote",
				tile: i
			});
		};
		const restart = () => {
			send({ type: "restart" });
			set(showEntries, false);
			set(entries, {}, true);
		};
		const clearInfo = () => {
			set(showEntries, false);
			send({ type: "reset_entries" });
		};
		var main = root_10();
		var node = child(main);
		SocketClient(node, {
			socketLoad,
			get connected() {
				return get(connected);
			},
			set connected($$value) {
				set(connected, $$value, true);
			}
		});
		var node_1 = sibling(node, 2);
		var consequent_8 = ($$anchor) => {
			var fragment = root_8();
			var node_2 = first_child(fragment);
			var consequent_1 = ($$anchor) => {
				var fragment_1 = comment();
				var node_3 = first_child(fragment_1);
				var consequent = ($$anchor) => {
					append($$anchor, root());
				};
				var alternate = ($$anchor) => {
					var div_1 = root_1();
					var button = child(div_1);
					reset(div_1);
					delegated("click", button, startGame);
					append($$anchor, div_1);
				};
				if_block(node_3, ($$render) => {
					if (!admin) $$render(consequent);
					else $$render(alternate, -1);
				});
				append($$anchor, fragment_1);
			};
			if_block(node_2, ($$render) => {
				if (!get(gameActive)) $$render(consequent_1);
			});
			var node_4 = sibling(node_2, 2);
			var consequent_2 = ($$anchor) => {
				var text$1 = text();
				template_effect(() => set_text(text$1, get(time)));
				append($$anchor, text$1);
			};
			if_block(node_4, ($$render) => {
				if (get(time) > 0) $$render(consequent_2);
			});
			var node_5 = sibling(node_4, 2);
			var consequent_3 = ($$anchor) => {
				append($$anchor, root_2());
			};
			if_block(node_5, ($$render) => {
				if (!get(collectiveTurn) && !admin && !get(ending)) $$render(consequent_3);
			});
			var node_6 = sibling(node_5, 2);
			var consequent_6 = ($$anchor) => {
				var fragment_3 = comment();
				var node_7 = first_child(fragment_3);
				var consequent_5 = ($$anchor) => {
					var div_3 = root_5();
					var text_1 = child(div_3);
					var button_1 = sibling(text_1);
					var node_8 = sibling(button_1, 2);
					var consequent_4 = ($$anchor) => {
						var fragment_4 = root_3();
						var button_2 = first_child(fragment_4);
						InfoPanel(sibling(button_2, 2), { get entries() {
							return get(entries);
						} });
						delegated("click", button_2, clearInfo);
						append($$anchor, fragment_4);
					};
					var alternate_1 = ($$anchor) => {
						var button_3 = root_4();
						delegated("click", button_3, () => set(showEntries, true));
						append($$anchor, button_3);
					};
					if_block(node_8, ($$render) => {
						if (get(showEntries)) $$render(consequent_4);
						else $$render(alternate_1, -1);
					});
					reset(div_3);
					template_effect(() => set_text(text_1, `${get(resultText) ?? ""} `));
					delegated("click", button_1, restart);
					append($$anchor, div_3);
				};
				var alternate_2 = ($$anchor) => {
					var div_4 = root_6();
					var text_2 = child(div_4, true);
					reset(div_4);
					template_effect(() => set_text(text_2, get(resultText)));
					append($$anchor, div_4);
				};
				if_block(node_7, ($$render) => {
					if (admin) $$render(consequent_5);
					else $$render(alternate_2, -1);
				});
				append($$anchor, fragment_3);
			};
			if_block(node_6, ($$render) => {
				if (get(ending) != "") $$render(consequent_6);
			});
			var div_5 = sibling(node_6, 2);
			each(div_5, 21, () => get(board), index, ($$anchor, tile, i) => {
				Tile($$anchor, {
					get votes() {
						return get(tile).votes;
					},
					get total() {
						return get(totalVotes);
					},
					get state() {
						return get(tile).state;
					},
					onvote: () => onTileVote(i)
				});
			});
			reset(div_5);
			var node_10 = sibling(div_5, 2);
			var consequent_7 = ($$anchor) => {
				var div_6 = root_7();
				var button_4 = child(div_6);
				var button_5 = sibling(button_4, 2);
				var button_6 = sibling(button_5, 2);
				reset(div_6);
				delegated("click", button_4, () => send({
					type: "ending",
					ending: "x"
				}));
				delegated("click", button_5, () => send({
					type: "ending",
					ending: "o"
				}));
				delegated("click", button_6, () => send({
					type: "ending",
					ending: "s"
				}));
				append($$anchor, div_6);
			};
			if_block(node_10, ($$render) => {
				if (get(gameActive) && admin) $$render(consequent_7);
			});
			append($$anchor, fragment);
		};
		var alternate_3 = ($$anchor) => {
			append($$anchor, root_9());
		};
		if_block(node_1, ($$render) => {
			if (get(connected)) $$render(consequent_8);
			else $$render(alternate_3, -1);
		});
		reset(main);
		append($$anchor, main);
		pop();
	}
	delegate(["click"]);
	mount(App, { target: document.body });
	//#endregion
})();

//# sourceMappingURL=bundle.js.map