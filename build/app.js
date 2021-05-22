
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const activePage = writable(1);

    const pages = {
        ELEMENTS: 1,
        LAYERS: 2,
        SETTINGS: 3,
    };

    /* src\editor\components\ActivityBar\ActivityBar.svelte generated by Svelte v3.32.1 */
    const file = "src\\editor\\components\\ActivityBar\\ActivityBar.svelte";

    function create_fragment(ctx) {
    	let div7;
    	let div0;
    	let a;
    	let i0;
    	let t0;
    	let div4;
    	let div1;
    	let i1;
    	let t1;
    	let div2;
    	let i2;
    	let t2;
    	let div3;
    	let i3;
    	let t3;
    	let div6;
    	let div5;
    	let i4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div0 = element("div");
    			a = element("a");
    			i0 = element("i");
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i1 = element("i");
    			t1 = space();
    			div2 = element("div");
    			i2 = element("i");
    			t2 = space();
    			div3 = element("div");
    			i3 = element("i");
    			t3 = space();
    			div6 = element("div");
    			div5 = element("div");
    			i4 = element("i");
    			attr_dev(i0, "class", "bi bi-layout-text-window-reverse svelte-12zrox2");
    			add_location(i0, file, 58, 20, 1180);
    			attr_dev(a, "href", "/");
    			attr_dev(a, "class", "svelte-12zrox2");
    			add_location(a, file, 58, 8, 1168);
    			attr_dev(div0, "class", "logo circle tilted svelte-12zrox2");
    			add_location(div0, file, 57, 4, 1126);
    			attr_dev(i1, "class", "bi bi-front svelte-12zrox2");
    			add_location(i1, file, 66, 12, 1458);
    			attr_dev(div1, "class", "logo my-4 svelte-12zrox2");
    			attr_dev(div1, "title", "Elements");
    			toggle_class(div1, "active", /*$activePage*/ ctx[0] == pages.ELEMENTS);
    			add_location(div1, file, 62, 8, 1282);
    			attr_dev(i2, "class", "bi bi-layers svelte-12zrox2");
    			add_location(i2, file, 73, 12, 1691);
    			attr_dev(div2, "class", "logo my-4 svelte-12zrox2");
    			attr_dev(div2, "title", "Layers");
    			toggle_class(div2, "active", /*$activePage*/ ctx[0] == pages.LAYERS);
    			add_location(div2, file, 69, 8, 1521);
    			attr_dev(i3, "class", "bi bi-gear svelte-12zrox2");
    			add_location(i3, file, 80, 12, 1923);
    			attr_dev(div3, "class", "logo my-4 svelte-12zrox2");
    			attr_dev(div3, "title", "Settings");
    			toggle_class(div3, "active", /*$activePage*/ ctx[0] == pages.SETTINGS);
    			add_location(div3, file, 76, 8, 1747);
    			attr_dev(div4, "class", "drawer svelte-12zrox2");
    			add_location(div4, file, 61, 4, 1252);
    			attr_dev(i4, "class", "bi bi-person-circle svelte-12zrox2");
    			attr_dev(i4, "title", "About me");
    			add_location(i4, file, 86, 12, 2054);
    			attr_dev(div5, "class", "logo svelte-12zrox2");
    			add_location(div5, file, 85, 8, 2022);
    			attr_dev(div6, "class", "bottom-drawer svelte-12zrox2");
    			add_location(div6, file, 84, 4, 1985);
    			attr_dev(div7, "class", "activity-bar svelte-12zrox2");
    			add_location(div7, file, 56, 0, 1094);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div0);
    			append_dev(div0, a);
    			append_dev(a, i0);
    			append_dev(div7, t0);
    			append_dev(div7, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i1);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, i2);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, i3);
    			append_dev(div7, t3);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, i4);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[3], false, false, false),
    					listen_dev(div3, "click", /*click_handler_2*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$activePage, pages*/ 1) {
    				toggle_class(div1, "active", /*$activePage*/ ctx[0] == pages.ELEMENTS);
    			}

    			if (dirty & /*$activePage, pages*/ 1) {
    				toggle_class(div2, "active", /*$activePage*/ ctx[0] == pages.LAYERS);
    			}

    			if (dirty & /*$activePage, pages*/ 1) {
    				toggle_class(div3, "active", /*$activePage*/ ctx[0] == pages.SETTINGS);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $activePage;
    	validate_store(activePage, "activePage");
    	component_subscribe($$self, activePage, $$value => $$invalidate(0, $activePage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ActivityBar", slots, []);

    	function goToPage(pageID) {
    		set_store_value(activePage, $activePage = pageID, $activePage);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ActivityBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => goToPage(pages.ELEMENTS);
    	const click_handler_1 = () => goToPage(pages.LAYERS);
    	const click_handler_2 = () => goToPage(pages.SETTINGS);
    	$$self.$capture_state = () => ({ activePage, pages, goToPage, $activePage });
    	return [$activePage, goToPage, click_handler, click_handler_1, click_handler_2];
    }

    class ActivityBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActivityBar",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\editor\components\Navbar\ProjectName.svelte generated by Svelte v3.32.1 */

    const { document: document_1 } = globals;
    const file$1 = "src\\editor\\components\\Navbar\\ProjectName.svelte";

    // (48:0) {:else}
    function create_else_block(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "project-title-input svelte-1bzbw03");
    			add_location(input, file$1, 48, 4, 1175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*projectName*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(input, "blur", /*saveProjectName*/ ctx[7], false, false, false),
    					listen_dev(input, "keyup", /*handelProjectNameEnter*/ ctx[6], false, false, false),
    					action_destroyer(focusInput.call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*projectName*/ 1 && input.value !== /*projectName*/ ctx[0]) {
    				set_input_value(input, /*projectName*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(48:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:0) {#if !isEditable}
    function create_if_block(ctx) {
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*displayProjectName*/ ctx[3]);
    			attr_dev(span, "class", "navbar-brand project-title-display svelte-1bzbw03");
    			attr_dev(span, "role", "button");
    			add_location(span, file$1, 44, 4, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*handelProjectName*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*displayProjectName*/ 8) set_data_dev(t, /*displayProjectName*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(44:0) {#if !isEditable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let title_value;
    	let t;
    	let if_block_anchor;

    	document_1.title = title_value = "\r\n    " + (/*finalProjectName*/ ctx[1].length && /*finalProjectName*/ ctx[1] != "Untitled"
    	? /*displayProjectName*/ ctx[3] + " | "
    	: "") + " " + /*siteTitle*/ ctx[4] + "\r\n  ";

    	function select_block_type(ctx, dirty) {
    		if (!/*isEditable*/ ctx[2]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*finalProjectName, displayProjectName, siteTitle*/ 26 && title_value !== (title_value = "\r\n    " + (/*finalProjectName*/ ctx[1].length && /*finalProjectName*/ ctx[1] != "Untitled"
    			? /*displayProjectName*/ ctx[3] + " | "
    			: "") + " " + /*siteTitle*/ ctx[4] + "\r\n  ")) {
    				document_1.title = title_value;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function focusInput(el) {
    	el.select();
    	el.focus();
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let displayProjectName;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ProjectName", slots, []);
    	let siteTitle = document.title;
    	let projectName = "Untitled";
    	let finalProjectName = projectName;
    	let isEditable = false;

    	function handelProjectName() {
    		$$invalidate(2, isEditable = true);
    	}

    	function handelProjectNameEnter(event) {
    		if (event.code == "Enter") {
    			event.preventDefault();
    			return saveProjectName();
    		}
    	}

    	function saveProjectName() {
    		$$invalidate(2, isEditable = false);

    		if (!projectName.length) {
    			$$invalidate(0, projectName = "Untitled");
    			$$invalidate(1, finalProjectName = projectName);
    		} else {
    			$$invalidate(1, finalProjectName = projectName);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ProjectName> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		projectName = this.value;
    		$$invalidate(0, projectName);
    	}

    	$$self.$capture_state = () => ({
    		siteTitle,
    		projectName,
    		finalProjectName,
    		isEditable,
    		handelProjectName,
    		handelProjectNameEnter,
    		saveProjectName,
    		focusInput,
    		displayProjectName
    	});

    	$$self.$inject_state = $$props => {
    		if ("siteTitle" in $$props) $$invalidate(4, siteTitle = $$props.siteTitle);
    		if ("projectName" in $$props) $$invalidate(0, projectName = $$props.projectName);
    		if ("finalProjectName" in $$props) $$invalidate(1, finalProjectName = $$props.finalProjectName);
    		if ("isEditable" in $$props) $$invalidate(2, isEditable = $$props.isEditable);
    		if ("displayProjectName" in $$props) $$invalidate(3, displayProjectName = $$props.displayProjectName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*projectName*/ 1) {
    			 $$invalidate(3, displayProjectName = projectName.length > 18
    			? projectName.substring(0, 15) + "..."
    			: projectName);
    		}
    	};

    	return [
    		projectName,
    		finalProjectName,
    		isEditable,
    		displayProjectName,
    		siteTitle,
    		handelProjectName,
    		handelProjectNameEnter,
    		saveProjectName,
    		input_input_handler
    	];
    }

    class ProjectName extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectName",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\editor\components\Navbar\Navbar.svelte generated by Svelte v3.32.1 */
    const file$2 = "src\\editor\\components\\Navbar\\Navbar.svelte";

    function create_fragment$2(ctx) {
    	let nav;
    	let div1;
    	let projectname;
    	let t0;
    	let button0;
    	let span0;
    	let t1;
    	let div0;
    	let ul;
    	let li;
    	let button1;
    	let i0;
    	let t2;
    	let span1;
    	let t4;
    	let button2;
    	let i1;
    	let t5;
    	let span2;
    	let current;
    	projectname = new ProjectName({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div1 = element("div");
    			create_component(projectname.$$.fragment);
    			t0 = space();
    			button0 = element("button");
    			span0 = element("span");
    			t1 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li = element("li");
    			button1 = element("button");
    			i0 = element("i");
    			t2 = space();
    			span1 = element("span");
    			span1.textContent = "Download";
    			t4 = space();
    			button2 = element("button");
    			i1 = element("i");
    			t5 = space();
    			span2 = element("span");
    			span2.textContent = "Preview";
    			attr_dev(span0, "class", "navbar-toggler-icon");
    			add_location(span0, file$2, 8, 6, 370);
    			attr_dev(button0, "class", "navbar-toggler");
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "data-bs-toggle", "collapse");
    			attr_dev(button0, "data-bs-target", "#navbarNav");
    			attr_dev(button0, "aria-controls", "navbarNav");
    			attr_dev(button0, "aria-expanded", "false");
    			attr_dev(button0, "aria-label", "Toggle navigation");
    			add_location(button0, file$2, 7, 4, 184);
    			attr_dev(i0, "class", "bi bi-download");
    			add_location(i0, file$2, 13, 39, 597);
    			add_location(span1, file$2, 13, 70, 628);
    			attr_dev(button1, "class", "btn btn-main");
    			add_location(button1, file$2, 13, 10, 568);
    			attr_dev(i1, "class", "bi bi-eye");
    			add_location(i1, file$2, 14, 39, 699);
    			add_location(span2, file$2, 14, 65, 725);
    			attr_dev(button2, "class", "btn btn-main");
    			add_location(button2, file$2, 14, 10, 670);
    			attr_dev(li, "class", "nav-item");
    			add_location(li, file$2, 12, 8, 535);
    			attr_dev(ul, "class", "navbar-nav nav-left svelte-lu0ryt");
    			add_location(ul, file$2, 11, 6, 493);
    			attr_dev(div0, "class", "collapse navbar-collapse");
    			attr_dev(div0, "id", "navbarNav");
    			add_location(div0, file$2, 10, 4, 432);
    			attr_dev(div1, "class", "container-fluid");
    			add_location(div1, file$2, 5, 2, 128);
    			attr_dev(nav, "class", "navbar navbar-expand-lg navbar-light svelte-lu0ryt");
    			add_location(nav, file$2, 4, 0, 74);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div1);
    			mount_component(projectname, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, button0);
    			append_dev(button0, span0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li);
    			append_dev(li, button1);
    			append_dev(button1, i0);
    			append_dev(button1, t2);
    			append_dev(button1, span1);
    			append_dev(li, t4);
    			append_dev(li, button2);
    			append_dev(button2, i1);
    			append_dev(button2, t5);
    			append_dev(button2, span2);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projectname.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projectname.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(projectname);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Navbar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ ProjectName });
    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    var elementStore = writable(null);

    function showWelcomeMessage(message){
        console.log(
            `%c${message}`,

            `color: #df6b42;
        font-family: system-ui;
        font-size: 15px;
        -webkit-text-stroke: 0.5px black;
        font-weight: bold`
        );
    }

    function templateToHtml(htmlString){
        if(htmlString){
            const parsedHtml = new DOMParser().parseFromString(htmlString, "text/html");

            return parsedHtml.body.firstElementChild;
        }

        return document.createElement("span");
    }

    function isBodyElement(element = {}){
        return element.tagName == "BODY"
    }

    function getInsertPosition(dropzone, clientY){
        const box = dropzone.getBoundingClientRect();
        const offset = clientY - box.top - (box.height / 2);

        let position = "";

        if (offset < 10 && offset > -10) {
            position = "inside";
        } else if (offset < -10) {
            position = "prepend";
        } else if (offset > 10) {
            position = "append";  
        }

        return position;
    }

    function insertElement(element, dropzone, position = "inside"){
        switch(position){
            case "inside": dropzone.appendChild(element); break; 
            case "prepend": dropzone.parentElement.insertBefore(element, dropzone); break; 
            case "append": dropzone.parentElement.insertBefore(element, dropzone.nextElementSibling); break;
        }
    }

    function addOutline(el){
        el.setAttribute("editor-outline", "");
    }

    function removeOutline(el){
        el.removeAttribute('editor-outline');
    }

    function addInsertPreview(el, position = "inside"){
        el.setAttribute("editor-insert-preview", position);
    }

    function removeInsertPreview(el){
        el.removeAttribute("editor-insert-preview");
    }

    function onDragStart(event){
        event.dataTransfer.setData('text/plain', event.target.dataset.elementId);
        event.currentTarget.style.opacity = "0.5";
    }

    function onDragOver(event) {
        event.preventDefault();

        let dropZone = event.target;

        const position = isBodyElement(dropZone) ? "inside" : getInsertPosition(dropZone, event.clientY);

        addInsertPreview(dropZone, position);
    }

    function onDrop(event) {

        const id = parseInt(event.dataTransfer.getData('text'));

        let dropZone = event.target;

        removeInsertPreview(dropZone);

        console.log(dropZone.tagName);

        event.dataTransfer.clearData();

        const position = isBodyElement(dropZone) ? "inside" : getInsertPosition(dropZone, event.clientY);

        const unsubscribe = elementStore.subscribe((elementsMap) => {
            const element = elementsMap.get(id);

            const parsedHtml = templateToHtml(element?.template);

            insertElement(parsedHtml, dropZone, position);
        });

        unsubscribe();

        event.dataTransfer.clearData();
    }

    function onDragEnter(event) {
        if (event.target.tagName == "BODY") return;
    }

    function onDragLeave(event) {
        let dropZone = event.target;

        removeInsertPreview(dropZone);
    }

    function onDragEnd(event) {
        event.target.style.removeProperty("opacity");
    }

    /* src\editor\components\Sidebar\Elements\Design\Design.svelte generated by Svelte v3.32.1 */
    const file$3 = "src\\editor\\components\\Sidebar\\Elements\\Design\\Design.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (68:0) {#if activeElements.length}
    function create_if_block$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*activeElements*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "elements svelte-169vmu3");
    			add_location(div, file$3, 68, 4, 1627);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*activeElements, onDragStart, onDragEnd*/ 2) {
    				each_value = /*activeElements*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(68:0) {#if activeElements.length}",
    		ctx
    	});

    	return block;
    }

    // (70:8) {#each activeElements as element}
    function create_each_block(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let i;
    	let i_class_value;
    	let t0;
    	let div1;
    	let span;
    	let t1_value = /*element*/ ctx[5].display_name + "";
    	let t1;
    	let t2;
    	let div3_data_element_id_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(i, "class", i_class_value = "" + (null_to_empty(/*element*/ ctx[5].icon) + " svelte-169vmu3"));
    			add_location(i, file$3, 77, 44, 2032);
    			attr_dev(div0, "class", "image mb-1 svelte-169vmu3");
    			add_location(div0, file$3, 77, 20, 2008);
    			add_location(span, file$3, 78, 38, 2108);
    			attr_dev(div1, "class", "name svelte-169vmu3");
    			add_location(div1, file$3, 78, 20, 2090);
    			attr_dev(div2, "class", "text-center py-4");
    			add_location(div2, file$3, 76, 16, 1956);
    			attr_dev(div3, "class", "card col-6 svelte-169vmu3");
    			attr_dev(div3, "draggable", "true");
    			attr_dev(div3, "data-element-id", div3_data_element_id_value = /*element*/ ctx[5].id);
    			add_location(div3, file$3, 70, 12, 1706);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, i);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, span);
    			append_dev(span, t1);
    			append_dev(div3, t2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div3, "dragstart", onDragStart, false, false, false),
    					listen_dev(div3, "dragend", onDragEnd, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*activeElements*/ 2 && i_class_value !== (i_class_value = "" + (null_to_empty(/*element*/ ctx[5].icon) + " svelte-169vmu3"))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if ((!current || dirty & /*activeElements*/ 2) && t1_value !== (t1_value = /*element*/ ctx[5].display_name + "")) set_data_dev(t1, t1_value);

    			if (!current || dirty & /*activeElements*/ 2 && div3_data_element_id_value !== (div3_data_element_id_value = /*element*/ ctx[5].id)) {
    				attr_dev(div3, "data-element-id", div3_data_element_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 100 }, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { duration: 100 }, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(70:8) {#each activeElements as element}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let input;
    	let t;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*activeElements*/ ctx[1].length && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control search-bar svelte-169vmu3");
    			attr_dev(input, "placeholder", "Search elements");
    			add_location(input, file$3, 64, 4, 1479);
    			attr_dev(div, "class", "search-holder svelte-169vmu3");
    			add_location(div, file$3, 63, 0, 1446);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);
    			set_input_value(input, /*search*/ ctx[0]);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_input_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*search*/ 1 && input.value !== /*search*/ ctx[0]) {
    				set_input_value(input, /*search*/ ctx[0]);
    			}

    			if (/*activeElements*/ ctx[1].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*activeElements*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let activeElements;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Design", slots, []);

    	const elements = [
    		{
    			id: 1,
    			name: "section",
    			display_name: "Section",
    			icon: "bi bi-square",
    			template: "<section builder-section></section>"
    		},
    		{
    			id: 2,
    			name: "heading",
    			display_name: "Heading",
    			icon: "bi bi-fonts",
    			template: "<h1>Hello</h1>"
    		},
    		{
    			id: 3,
    			name: "text",
    			display_name: "Text",
    			icon: "bi bi-paragraph",
    			template: "<p>Text</p>"
    		},
    		{
    			id: 4,
    			name: "grid",
    			display_name: "Grid",
    			icon: "bi bi-columns",
    			template: "<div editor-grid></div>"
    		}
    	];

    	const elementMap = new Map();

    	elements.forEach(element => {
    		elementMap.set(element.id, element);
    	});

    	elementStore.set(elementMap);
    	let search = "";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Design> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		search = this.value;
    		$$invalidate(0, search);
    	}

    	$$self.$capture_state = () => ({
    		fade,
    		onDragStart,
    		onDragEnd,
    		elementStore,
    		elements,
    		elementMap,
    		search,
    		activeElements
    	});

    	$$self.$inject_state = $$props => {
    		if ("search" in $$props) $$invalidate(0, search = $$props.search);
    		if ("activeElements" in $$props) $$invalidate(1, activeElements = $$props.activeElements);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*search*/ 1) {
    			 $$invalidate(1, activeElements = elements.filter(el => el.display_name.toLowerCase().match(search.toLowerCase())));
    		}
    	};

    	return [search, activeElements, input_input_handler];
    }

    class Design extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Design",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\editor\components\Sidebar\Elements\Styling\Styling.svelte generated by Svelte v3.32.1 */
    const file$4 = "src\\editor\\components\\Sidebar\\Elements\\Styling\\Styling.svelte";

    function create_fragment$4(ctx) {
    	let div2;
    	let div1;
    	let h6;
    	let t1;
    	let div0;
    	let label;
    	let t3;
    	let input;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h6 = element("h6");
    			h6.textContent = "General";
    			t1 = space();
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "Text";
    			t3 = space();
    			input = element("input");
    			attr_dev(h6, "class", "border-bottom pb-3 mb-3");
    			add_location(h6, file$4, 32, 8, 863);
    			attr_dev(label, "for", "text-input");
    			attr_dev(label, "class", "mb-2");
    			add_location(label, file$4, 34, 12, 959);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "text-input");
    			attr_dev(input, "class", "form-control text svelte-7j4jym");
    			add_location(input, file$4, 35, 12, 1022);
    			attr_dev(div0, "class", "form-group");
    			add_location(div0, file$4, 33, 8, 921);
    			attr_dev(div1, "class", "col-md-12");
    			add_location(div1, file$4, 31, 4, 830);
    			attr_dev(div2, "class", "styling-tab svelte-7j4jym");
    			add_location(div2, file$4, 30, 0, 799);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h6);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(div0, t3);
    			append_dev(div0, input);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Styling", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Styling> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ fly });
    	return [];
    }

    class Styling extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Styling",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\editor\components\Sidebar\Elements\index.svelte generated by Svelte v3.32.1 */
    const file$5 = "src\\editor\\components\\Sidebar\\Elements\\index.svelte";

    // (45:2) {:else}
    function create_else_block$1(ctx) {
    	let section;
    	let styling;
    	let section_intro;
    	let section_outro;
    	let current;
    	styling = new Styling({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(styling.$$.fragment);
    			attr_dev(section, "class", "h-100");
    			add_location(section, file$5, 46, 2, 1323);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(styling, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(styling.$$.fragment, local);

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				if (!section_intro) section_intro = create_in_transition(section, fly, { x: 200 });
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(styling.$$.fragment, local);
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, fly, { x: 200, duration: 0 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(styling);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(45:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:2) {#if isPageDesign}
    function create_if_block$2(ctx) {
    	let section;
    	let design;
    	let section_intro;
    	let section_outro;
    	let current;
    	design = new Design({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(design.$$.fragment);
    			attr_dev(section, "class", "h-100");
    			add_location(section, file$5, 40, 2, 1190);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(design, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(design.$$.fragment, local);

    			add_render_callback(() => {
    				if (section_outro) section_outro.end(1);
    				if (!section_intro) section_intro = create_in_transition(section, fly, { x: -200 });
    				section_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(design.$$.fragment, local);
    			if (section_intro) section_intro.invalidate();
    			section_outro = create_out_transition(section, fly, { x: -200, duration: 0 });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(design);
    			if (detaching && section_outro) section_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(39:2) {#if isPageDesign}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let ul;
    	let li0;
    	let span0;
    	let t1;
    	let li1;
    	let span1;
    	let t3;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isPageDesign*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			span0 = element("span");
    			span0.textContent = "Design";
    			t1 = space();
    			li1 = element("li");
    			span1 = element("span");
    			span1.textContent = "Styles";
    			t3 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(span0, "class", "nav-link svelte-yvpr94");
    			toggle_class(span0, "active", /*isDesigning*/ ctx[0]);
    			add_location(span0, file$5, 30, 14, 890);
    			attr_dev(li0, "class", "nav-item col-6");
    			add_location(li0, file$5, 29, 10, 823);
    			attr_dev(span1, "class", "nav-link svelte-yvpr94");
    			toggle_class(span1, "active", !/*isDesigning*/ ctx[0]);
    			add_location(span1, file$5, 33, 14, 1052);
    			attr_dev(li1, "class", "nav-item col-6");
    			add_location(li1, file$5, 32, 10, 984);
    			attr_dev(ul, "class", "nav nav-tabs svelte-yvpr94");
    			add_location(ul, file$5, 28, 6, 786);
    			attr_dev(div, "class", "tabs");
    			add_location(div, file$5, 27, 2, 760);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(li0, span0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, span1);
    			insert_dev(target, t3, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li0, "click", /*goToDesign*/ ctx[2], false, false, false),
    					listen_dev(li1, "click", /*goToStyling*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*isDesigning*/ 1) {
    				toggle_class(span0, "active", /*isDesigning*/ ctx[0]);
    			}

    			if (dirty & /*isDesigning*/ 1) {
    				toggle_class(span1, "active", !/*isDesigning*/ ctx[0]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t3);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let isPageDesign;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Elements", slots, []);
    	let isDesigning = true;

    	function goToDesign() {
    		if (!isDesigning) {
    			$$invalidate(0, isDesigning = true);
    		}
    	}

    	function goToStyling() {
    		if (isDesigning) {
    			$$invalidate(0, isDesigning = false);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Elements> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fly,
    		Design,
    		Styling,
    		isDesigning,
    		goToDesign,
    		goToStyling,
    		isPageDesign
    	});

    	$$self.$inject_state = $$props => {
    		if ("isDesigning" in $$props) $$invalidate(0, isDesigning = $$props.isDesigning);
    		if ("isPageDesign" in $$props) $$invalidate(1, isPageDesign = $$props.isPageDesign);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isDesigning*/ 1) {
    			 $$invalidate(1, isPageDesign = isDesigning);
    		}
    	};

    	return [isDesigning, isPageDesign, goToDesign, goToStyling];
    }

    class Elements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Elements",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const mainDocument = writable(null);

    const selectedElement = writable(null);

    const loaded = derived(mainDocument, $mainDocument => $mainDocument != null? true : false);

    /* src\editor\components\Sidebar\Layers\Layers.svelte generated by Svelte v3.32.1 */
    const file$6 = "src\\editor\\components\\Sidebar\\Layers\\Layers.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (40:4) {#if layersGenerated}
    function create_if_block$3(ctx) {
    	let each_1_anchor;
    	let each_value = /*layers*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*layers, $selectedElement, addOutline, selectElement, removeOutline*/ 14) {
    				each_value = /*layers*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(40:4) {#if layersGenerated}",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each layers as layer}
    function create_each_block$1(ctx) {
    	let div;
    	let span;
    	let t0_value = /*layer*/ ctx[9].el.tagName + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function mouseenter_handler() {
    		return /*mouseenter_handler*/ ctx[4](/*layer*/ ctx[9]);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*layer*/ ctx[9]);
    	}

    	function mouseleave_handler() {
    		return /*mouseleave_handler*/ ctx[6](/*layer*/ ctx[9]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(span, file$6, 48, 16, 1350);
    			attr_dev(div, "class", "div col-12 w-75 border element svelte-1nmg79i");
    			set_style(div, "cursor", "pointer");
    			set_style(div, "padding", "10px");
    			set_style(div, "margin", "10px " + /*layer*/ ctx[9].spacing + "px");
    			toggle_class(div, "active", /*$selectedElement*/ ctx[1] == /*layer*/ ctx[9].el);
    			add_location(div, file$6, 41, 12, 956);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", mouseenter_handler, false, false, false),
    					listen_dev(div, "click", click_handler, false, false, false),
    					listen_dev(div, "mouseleave", mouseleave_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$selectedElement, layers*/ 6) {
    				toggle_class(div, "active", /*$selectedElement*/ ctx[1] == /*layer*/ ctx[9].el);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(41:8) {#each layers as layer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let if_block = /*layersGenerated*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "layers-tab svelte-1nmg79i");
    			add_location(div, file$6, 38, 0, 858);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*layersGenerated*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function walkDom(el, callback, spacing = "") {
    	if (callback(el, spacing) === false) return;
    	let node = el.firstElementChild;

    	while (node) {
    		walkDom(node, callback, spacing + "---");
    		node = node.nextElementSibling;
    	}
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $loaded;
    	let $mainDocument;
    	let $selectedElement;
    	validate_store(loaded, "loaded");
    	component_subscribe($$self, loaded, $$value => $$invalidate(7, $loaded = $$value));
    	validate_store(mainDocument, "mainDocument");
    	component_subscribe($$self, mainDocument, $$value => $$invalidate(8, $mainDocument = $$value));
    	validate_store(selectedElement, "selectedElement");
    	component_subscribe($$self, selectedElement, $$value => $$invalidate(1, $selectedElement = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Layers", slots, []);
    	let layersGenerated = false;
    	const layers = [];

    	if ($loaded) {
    		walkDom($mainDocument.body, (el, spacing) => {
    			if (spacing) layers.push({ el, spacing: spacing.length });
    		});

    		layersGenerated = true;
    	}

    	function selectElement(el) {
    		$selectedElement && $selectedElement.removeAttribute("editor-selected");

    		if ($selectedElement === el) {
    			set_store_value(selectedElement, $selectedElement = null, $selectedElement);
    		} else {
    			set_store_value(selectedElement, $selectedElement = el, $selectedElement);
    			$selectedElement.setAttribute("editor-selected", "");
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layers> was created with unknown prop '${key}'`);
    	});

    	const mouseenter_handler = layer => addOutline(layer.el);
    	const click_handler = layer => selectElement(layer.el);
    	const mouseleave_handler = layer => removeOutline(layer.el);

    	$$self.$capture_state = () => ({
    		mainDocument,
    		loaded,
    		selectedElement,
    		addOutline,
    		removeOutline,
    		layersGenerated,
    		layers,
    		walkDom,
    		selectElement,
    		$loaded,
    		$mainDocument,
    		$selectedElement
    	});

    	$$self.$inject_state = $$props => {
    		if ("layersGenerated" in $$props) $$invalidate(0, layersGenerated = $$props.layersGenerated);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		layersGenerated,
    		$selectedElement,
    		layers,
    		selectElement,
    		mouseenter_handler,
    		click_handler,
    		mouseleave_handler
    	];
    }

    class Layers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layers",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    function isDarkMode(){
        return localStorage.getItem("dark-mode") ? true : false;
    }

    function setDarkMode(){
        let faviconTag = document.querySelector("link[rel~='icon']");

        document.body.classList.add("dark-mode");

        localStorage.setItem("dark-mode", true);

        faviconTag.href = `/favicons/favicon-dark.ico`;
    }

    function setLightMode(){
        let faviconTag = document.querySelector("link[rel~='icon']");

        document.body.classList.remove("dark-mode");

        localStorage.removeItem("dark-mode");

        faviconTag.href = `/favicons/favicon.ico`;
    }

    function setThemeMode(){
        isDarkMode() ? setDarkMode() : setLightMode();
    }

    function toggleDarkMode(){
        !isDarkMode() ? setDarkMode() : setLightMode();
    }

    /* src\editor\components\Sidebar\Settings\DarkMode\DarkMode.svelte generated by Svelte v3.32.1 */
    const file$7 = "src\\editor\\components\\Sidebar\\Settings\\DarkMode\\DarkMode.svelte";

    function create_fragment$7(ctx) {
    	let section;
    	let div3;
    	let div0;
    	let label0;
    	let t1;
    	let div2;
    	let div1;
    	let input;
    	let t2;
    	let label1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Dark mode";
    			t1 = space();
    			div2 = element("div");
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			label1 = element("label");
    			attr_dev(label0, "for", "toggle");
    			add_location(label0, file$7, 60, 12, 1438);
    			attr_dev(div0, "class", "col-6");
    			add_location(div0, file$7, 59, 8, 1405);
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "toggle");
    			attr_dev(input, "class", "svelte-2vqqjm");
    			add_location(input, file$7, 64, 16, 1572);
    			attr_dev(label1, "for", "toggle");
    			attr_dev(label1, "class", "svelte-2vqqjm");
    			add_location(label1, file$7, 65, 16, 1680);
    			attr_dev(div1, "class", "toggle svelte-2vqqjm");
    			add_location(div1, file$7, 63, 12, 1534);
    			attr_dev(div2, "class", "col-6");
    			add_location(div2, file$7, 62, 8, 1501);
    			attr_dev(div3, "class", "form-group row");
    			add_location(div3, file$7, 58, 4, 1367);
    			attr_dev(section, "class", "svelte-2vqqjm");
    			add_location(section, file$7, 57, 0, 1352);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, input);
    			input.checked = /*darkMode*/ ctx[0];
    			append_dev(div1, t2);
    			append_dev(div1, label1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*input_change_handler*/ ctx[1]),
    					listen_dev(input, "input", toggleDarkMode, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*darkMode*/ 1) {
    				input.checked = /*darkMode*/ ctx[0];
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("DarkMode", slots, []);
    	let darkMode = isDarkMode();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DarkMode> was created with unknown prop '${key}'`);
    	});

    	function input_change_handler() {
    		darkMode = this.checked;
    		$$invalidate(0, darkMode);
    	}

    	$$self.$capture_state = () => ({ isDarkMode, toggleDarkMode, darkMode });

    	$$self.$inject_state = $$props => {
    		if ("darkMode" in $$props) $$invalidate(0, darkMode = $$props.darkMode);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [darkMode, input_change_handler];
    }

    class DarkMode extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DarkMode",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\editor\components\Sidebar\Settings\Settings.svelte generated by Svelte v3.32.1 */
    const file$8 = "src\\editor\\components\\Sidebar\\Settings\\Settings.svelte";

    function create_fragment$8(ctx) {
    	let section;
    	let darkmode;
    	let current;
    	darkmode = new DarkMode({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(darkmode.$$.fragment);
    			attr_dev(section, "class", "setting-tab");
    			add_location(section, file$8, 4, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(darkmode, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(darkmode.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(darkmode.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(darkmode);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Settings", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ DarkMode });
    	return [];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\editor\components\Sidebar\Sidebar.svelte generated by Svelte v3.32.1 */
    const file$9 = "src\\editor\\components\\Sidebar\\Sidebar.svelte";

    // (23:43) 
    function create_if_block_2(ctx) {
    	let section;
    	let settings;
    	let section_intro;
    	let current;
    	settings = new Settings({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(settings.$$.fragment);
    			attr_dev(section, "class", "h-100");
    			add_location(section, file$9, 23, 4, 584);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(settings, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);

    			if (!section_intro) {
    				add_render_callback(() => {
    					section_intro = create_in_transition(section, fade, { duration: 250 });
    					section_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(settings);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(23:43) ",
    		ctx
    	});

    	return block;
    }

    // (19:41) 
    function create_if_block_1(ctx) {
    	let section;
    	let layers;
    	let section_intro;
    	let current;
    	layers = new Layers({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(layers.$$.fragment);
    			attr_dev(section, "class", "h-100");
    			add_location(section, file$9, 19, 4, 451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(layers, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layers.$$.fragment, local);

    			if (!section_intro) {
    				add_render_callback(() => {
    					section_intro = create_in_transition(section, fade, { duration: 250 });
    					section_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layers.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(layers);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(19:41) ",
    		ctx
    	});

    	return block;
    }

    // (15:3) {#if $activePage == pages.ELEMENTS}
    function create_if_block$4(ctx) {
    	let section;
    	let elements;
    	let section_intro;
    	let current;
    	elements = new Elements({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(elements.$$.fragment);
    			attr_dev(section, "class", "h-100");
    			add_location(section, file$9, 15, 4, 318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(elements, section, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(elements.$$.fragment, local);

    			if (!section_intro) {
    				add_render_callback(() => {
    					section_intro = create_in_transition(section, fade, { duration: 250 });
    					section_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(elements.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(elements);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(15:3) {#if $activePage == pages.ELEMENTS}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$4, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$activePage*/ ctx[0] == pages.ELEMENTS) return 0;
    		if (/*$activePage*/ ctx[0] == pages.LAYERS) return 1;
    		if (/*$activePage*/ ctx[0] == pages.SETTINGS) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "sidenav svelte-1m7zlni");
    			add_location(div, file$9, 13, 0, 251);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $activePage;
    	validate_store(activePage, "activePage");
    	component_subscribe($$self, activePage, $$value => $$invalidate(0, $activePage = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		activePage,
    		pages,
    		Elements,
    		Layers,
    		Settings,
    		$activePage
    	});

    	return [$activePage];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\editor\components\Preview\Preview.svelte generated by Svelte v3.32.1 */
    const file$a = "src\\editor\\components\\Preview\\Preview.svelte";

    function create_fragment$a(ctx) {
    	let div1;
    	let div0;
    	let iframe_1;
    	let iframe_1_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			iframe_1 = element("iframe");
    			attr_dev(iframe_1, "title", "editor-preview");
    			if (iframe_1.src !== (iframe_1_src_value = "/preview/preview.html")) attr_dev(iframe_1, "src", iframe_1_src_value);
    			attr_dev(iframe_1, "frameborder", "0");
    			attr_dev(iframe_1, "allowtransparency", "true");
    			attr_dev(iframe_1, "class", "preview-window svelte-23ti04");
    			add_location(iframe_1, file$a, 32, 8, 1207);
    			attr_dev(div0, "class", "preview-main svelte-23ti04");
    			add_location(div0, file$a, 31, 4, 1171);
    			attr_dev(div1, "class", "col preview-holder svelte-23ti04");
    			add_location(div1, file$a, 30, 0, 1133);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, iframe_1);

    			if (!mounted) {
    				dispose = action_destroyer(/*iframe*/ ctx[0].call(null, iframe_1));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $mainDocument;
    	validate_store(mainDocument, "mainDocument");
    	component_subscribe($$self, mainDocument, $$value => $$invalidate(1, $mainDocument = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Preview", slots, []);

    	function iframe(el) {
    		let timer = setInterval(
    			function () {
    				let frame = el.contentDocument || el.contentWindow.document;
    				const isReady = ["complete", "interactive"].includes(frame.readyState);

    				if (isReady) {
    					set_store_value(mainDocument, $mainDocument = el.contentDocument, $mainDocument);
    					$mainDocument.body.addEventListener("dragover", event => onDragOver(event));
    					$mainDocument.body.addEventListener("drop", event => onDrop(event));
    					$mainDocument.body.addEventListener("dragenter", event => onDragEnter(event));
    					$mainDocument.body.addEventListener("dragleave", event => onDragLeave(event));
    					clearInterval(timer);

    					setTimeout(
    						() => {
    							showWelcomeMessage("Hi There 😃...");
    						},
    						1000
    					);
    				}
    			},
    			2000
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Preview> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		mainDocument,
    		onDragOver,
    		onDrop,
    		onDragEnter,
    		onDragLeave,
    		showWelcomeMessage,
    		iframe,
    		$mainDocument
    	});

    	return [iframe];
    }

    class Preview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Preview",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\editor\index.svelte generated by Svelte v3.32.1 */
    const file$b = "src\\editor\\index.svelte";

    function create_fragment$b(ctx) {
    	let div3;
    	let div2;
    	let activitybar;
    	let t0;
    	let div1;
    	let navbar;
    	let t1;
    	let div0;
    	let sidebar;
    	let t2;
    	let preview;
    	let current;
    	activitybar = new ActivityBar({ $$inline: true });
    	navbar = new Navbar({ $$inline: true });
    	sidebar = new Sidebar({ $$inline: true });
    	preview = new Preview({ $$inline: true });

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			create_component(activitybar.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			create_component(sidebar.$$.fragment);
    			t2 = space();
    			create_component(preview.$$.fragment);
    			attr_dev(div0, "class", "d-flex wrapper svelte-hrg01p");
    			add_location(div0, file$b, 16, 12, 485);
    			attr_dev(div1, "class", "col");
    			add_location(div1, file$b, 14, 8, 431);
    			attr_dev(div2, "class", "d-flex");
    			add_location(div2, file$b, 12, 4, 377);
    			attr_dev(div3, "class", "main svelte-hrg01p");
    			add_location(div3, file$b, 11, 0, 353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			mount_component(activitybar, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(navbar, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			mount_component(sidebar, div0, null);
    			append_dev(div0, t2);
    			mount_component(preview, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activitybar.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(preview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activitybar.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(preview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(activitybar);
    			destroy_component(navbar);
    			destroy_component(sidebar);
    			destroy_component(preview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Editor", slots, []);
    	setThemeMode();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Editor> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ActivityBar,
    		Navbar,
    		Sidebar,
    		Preview,
    		setThemeMode
    	});

    	return [];
    }

    class Editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Editor",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.32.1 */

    function create_fragment$c(ctx) {
    	let editor;
    	let current;
    	editor = new Editor({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(editor.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(editor, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Editor });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=app.js.map
