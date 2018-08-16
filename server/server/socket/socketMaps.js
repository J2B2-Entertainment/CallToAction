const {Citizen,Hero,User} = require('../db/models')

// socketId => socket
const newSocketMap = {}

// socketId => socket with id = heroId
const heroSocketMap = {}

// socketId => socket with id = citizenId
const citizenSocketMap = {}

module.exports.getHeroIdFromSocket = socketId => {
  if (heroSocketMap.hasOwnProperty(socketId)) {
    return heroSocketMap[socketId].id;
  }
  throw new Error('hero socket not found: ',socketId)
}

module.exports.getCitizenIdFromSocket = socketId => {
  if (citizenSocketMap.hasOwnProperty(socketId)) {
    return citizenSocketMap[socketId].id;
  }
  throw new Error('citizen socket not found: ',socketId)
}

module.exports.getSocketFromCitizenId = citizenId => {
  // May need a better implementation*****Maybe a citizenId to Socket map
  const foundEntry = Object.entries(citizenSocketMap).find((entry) => {
    const [, socket] = entry
    return socket.id === citizenId
  })
  if (foundEntry) {
    const [, socket] = foundEntry
    return socket
  }
  throw new Error('citizen socket not found. citizenId: ', citizenId)
}

module.exports.newSocket = socket => {
  newSocketMap[socket.id] = {
    socket: socket,
  }
}

module.exports.deleteSocket = async (socket) => {
  if (newSocketMap.hasOwnProperty(socket.id)) {
    delete newSocketMap[socket.id];
    printSockets('after deleteSocket - newSocketMap');
    return;
  }
  if (heroSocketMap.hasOwnProperty(socket.id)) {
    //mark hero unavailable/offline
    try {
      const hero = await Hero.findById(heroSocketMap[socket.id].id);
      await hero.update({loginStatus: 'offline', presenceStatus: 'unavailable', state: 'IDLE'})
    } catch (err) {
      console.log('error marking hero offline:', err)
      //fall through and at least try to clean up map
    }

    delete heroSocketMap[socket.id];
    printSockets('after deleteSocket - hero');
    return;
  }
  if (citizenSocketMap.hasOwnProperty(socket.id)) {
    //mark citizen IDLE
    try {
      const citizen = await Citizen.findById(citizenSocketMap[socket.id].id);
      await citizen.update({state: 'IDLE'})
    } catch (err) {
      console.log('error marking citizen IDLE:', err)
      //fall through and at least try to clean up map
    }

    delete citizenSocketMap[socket.id];
    printSockets('after deleteSocket - citizen')
  }
}

//we know socket is a hero -- move it to appropriate map
module.exports.promoteSocketToHero = (socketId,heroId) => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    heroSocketMap[socketId]=newSocketMap[socketId];
    heroSocketMap[socketId].id=heroId;
    delete newSocketMap[socketId];
  } else {
    throw new Error('promoteSocketToHero: socket id ',socketId,' not found')
  }
  printSockets('after promoteSocketToHero');
}

module.exports.promoteSocketToCitizen = (socketId,citizenId) => {
  if (newSocketMap.hasOwnProperty(socketId)) {
    citizenSocketMap[socketId]=newSocketMap[socketId];
    citizenSocketMap[socketId].id=citizenId;
    delete newSocketMap[socketId];
  } else {
    throw new Error('promoteSocketToCitizen: socket id ',socketId,' not found')
  }
  printSockets('after promoteSocketToCitizen')
}

function printSockets(desc) {
  console.log(desc)
  console.log('-newSocketMap: ',Object.keys(newSocketMap));
  console.log('-heroSocketMap: ',Object.keys(heroSocketMap));
  console.log('-citizenSocketMap: ',Object.keys(citizenSocketMap));
}
