import { EventEmitter } from "events";
import dispatcher from "../appDispatcher";
import actionTypes from "../actions/actionTypes";
import React from "react";
import SpotCarousel from "../components/SpotCarousel";
import { loadSpots } from "../actions/spotActions";

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
    console.log(_spot);
    return _spot;
  }

  getSpotById(id) {
    const selectedSpot = _spot.find((spot) => spot._id === id);

    return selectedSpot;
  }

  getCoordenates() {
    const reduceSpots = _spot.reduce((accumulator, currrentObject) => {
      const newObject = {
        _id: currrentObject._id,
        title: currrentObject.title,
        lat: currrentObject.lat,
        lgn: currrentObject.lgn,
        image: currrentObject.image,
        render: () => <SpotCarousel id={currrentObject._id} />,
      };
      accumulator.push(newObject);
      return accumulator;
    }, []);

    return reduceSpots;
  }

  getSuggestions() {
    const reduceSpotsSuggestions = _spot.reduce(
      (accumulator, currrentObject) => {
        const newObject = {
          _id: currrentObject._id,
          title: currrentObject.title,
          render: () => <SpotCarousel id={currrentObject._id} />,
        };
        accumulator.push(newObject);
        return accumulator;
      },
      []
    );

    return reduceSpotsSuggestions;
  }

  getCreatedSpots(username) {
    const createdSpots = _spot.filter((spot) => spot.username === username);
    return createdSpots;
  }
}

const spotStore = new SpotStore();
dispatcher.register((action) => {
  switch (action.type) {
    case actionTypes.LOAD_SPOT:
      _spot = action.data;
      spotStore.emitChange(_spot);
      break;
    case actionTypes.CREATE_SPOT:
      loadSpots();
      break;
    default:
      break;
  }
});

export default spotStore;
