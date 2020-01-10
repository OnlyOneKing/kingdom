/**
 * Created by CNG-laengyog on 2017/2/28.
 */
 import CngEvent from "./cngEvent.js";
 export default class storeEvent{
	static getInstance() {
		if (!storeEvent.instance) {
			storeEvent.instance = new CngEvent();
		}
		return storeEvent.instance;
	}	
}