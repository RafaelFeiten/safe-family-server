"use strict";

const getCurrentTime = () => {
  let data = new Date();

  return data.getTime();
};

function getDistance(position1, position2) {
  var deg2rad = function (deg) {
      return deg * (Math.PI / 180);
    },
    R = 6371,
    dLat = deg2rad(position2.latitude - position1.latitude),
    dLng = deg2rad(position2.longitude - position1.longitude),
    a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(position1.latitude)) *
        Math.cos(deg2rad(position1.latitude)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2),
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c * 1000).toFixed();
}

module.exports = {
  getCurrentTime,
  getDistance,
};
