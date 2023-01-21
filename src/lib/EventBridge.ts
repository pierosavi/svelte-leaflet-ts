import type { Evented } from 'leaflet';

type EventHandler = {
	event: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handler: (e: any) => void;
};

export default class EventBridge {
	entity: Evented;
	eventHandlers: EventHandler[];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor(entity: Evented, dispatch: (event: string, e: any) => void, events: string[] = []) {
		this.entity = entity;

		this.eventHandlers = [];
		if (events) {
			const eventMap: { [key: string]: EventHandler['handler'] } = {};
			events.forEach((event) => {
				if (!(event in eventMap)) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const handler = function (e: any) {
						dispatch(event, e);
					};
					this.eventHandlers.push({
						event,
						handler
					});
					entity.on(event, handler);
					eventMap[event] = handler;
				}
			});
		}
	}

	unregister() {
		this.eventHandlers.forEach((entry) => {
			this.entity.off(entry.event, entry.handler);
		});
	}
}
