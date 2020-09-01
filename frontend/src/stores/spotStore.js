import { EventEmitter } from "events";
import dispatcher from "../appDispatcher";
import actionTypes from "../actions/actionTypes";

const CHANGE_EVENT = "change";

let _spot = [];

class SpotStore extends EventEmitter {
  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  getSpots() {
    return _spot;
  }

  getSpotById(id) {
    //const selectedSpot = _spot.find((spot) => {spot._id === id});
    const selectedSpot = _spot[0];
    console.log(_spot[0]._id);
    console.log(_spot.find((spot) => spot._id === id));
    return selectedSpot;
  }
}

const spotStore = new SpotStore();
dispatcher.register((action) => {
  switch (action.type) {
    case actionTypes.LOAD_SPOT:
      _spot = action.data;
      spotStore.emitChange(_spot);
      break;

    default:
      break;
  }
});

export default spotStore;
