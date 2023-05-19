/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client/ajaxHelpers.js":
/*!*******************************!*\
  !*** ./client/ajaxHelpers.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fetchAllPlayers": () => (/* binding */ fetchAllPlayers),
/* harmony export */   "fetchSinglePlayer": () => (/* binding */ fetchSinglePlayer),
/* harmony export */   "addNewPlayer": () => (/* binding */ addNewPlayer),
/* harmony export */   "removePlayer": () => (/* binding */ removePlayer)
/* harmony export */ });
// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2303-ftb-et-web-pt';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;


const fetchAllPlayers = async () => {
    try {
        const response = await fetch(`${APIURL}players`);
        const result = await response.json();
        if (result.error) {
            throw result.error;
        }
        return result.data.players;
      } catch (error) {
        console.error('Uh oh, trouble fetching players!', error);
      }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + `players/${playerId}`);
        const result = await response.json();
        console.log(result);
        return result.data.player;
      } catch (err) {
        console.error(err);
      }

};

const addNewPlayer = async (playerObj) => {

    try {
        const response = await fetch(
          APIURL + `players`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                playerObj
            ),
          }
        );
        const result = await response.json();
        console.log(result);
      } catch (err) {
        console.error(err);
      }

};

const removePlayer = async (playerId) => {
    try {
     const response = await fetch(`${APIURL}/players/${playerId}`, {
       method: 'DELETE',
     });
        const result = await response.json();
        if (result.error) throw result.error;
        return;
    } catch (err) {
        console.error( `Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};


/***/ }),

/***/ "./client/renderHelpers.js":
/*!*********************************!*\
  !*** ./client/renderHelpers.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderAllPlayers": () => (/* binding */ renderAllPlayers),
/* harmony export */   "renderSinglePlayer": () => (/* binding */ renderSinglePlayer),
/* harmony export */   "renderNewPlayerForm": () => (/* binding */ renderNewPlayerForm)
/* harmony export */ });
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");


const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');


const renderAllPlayers = (playerList) => {
  // First check if we have any data before trying to render it!
  if (!playerList || !playerList.length) {
    playerContainer.innerHTML = '<h3>No players to display!</h3>';
    return;
  }

  // Loop through the list of players, and construct some HTML to display each one
  let playerContainerHTML = '';
  for (let i = 0; i < playerList.length; i++) {
    const pup = playerList[i];
    let pupHTML = `
      <div class="single-player-card">
        <div class="header-info">
          <p class="pup-title">${pup.name}</p>
          <p class="pup-number">#${pup.id}</p>
        </div>
        <img src="${pup.imageUrl}" alt="photo of ${pup.name} the puppy">
        <button class="detail-button" data-id=${pup.id}>See details</button>
        <button class="delete" data-id=${pup.id}>Remove from roster</button>
      </div>
    `;
    playerContainerHTML += pupHTML;
  }

  // After looping, fill the `playerContainer` div with the HTML we constructed above
  playerContainer.innerHTML = playerContainerHTML;

  // Now that the HTML for all players has been added to the DOM,
  // we want to grab those "See details" buttons on each player
  // and attach a click handler to each one
  let detailButtons = [...document.getElementsByClassName('detail-button')];
  for (let i = 0; i < detailButtons.length; i++) {
    const button = detailButtons[i];
    button.addEventListener('click', async () => {
      const result = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchSinglePlayer)(button.dataset.id);
      renderSinglePlayer(result);
    });
  }

  let deleteButtons = [...document.getElementsByClassName('delete')];
  for (let i = 0; i < deleteButtons.length; i++) {
  const button = deleteButtons[i];
  button.addEventListener('click', async () => {
    await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.removePlayer)(button.dataset.id);
    const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
    renderAllPlayers(players);
  });
  } 
};

const renderSinglePlayer = (playerObj) => {
  if (!playerObj || !playerObj.id) {
    playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
    return;
  }

  let pupHTML = `
    <div class="single-player-view">
      <div class="header-info">
        <p class="pup-title">${playerObj.name}</p>
        <p class="pup-number">#${playerObj.id}</p>
      </div>
      <p>Team: ${playerObj.team ? playerObj.team.name : 'Unassigned'}</p>
      <p>Breed: ${playerObj.breed}</p>
      <img src="${playerObj.imageUrl}" alt="photo of ${
    playerObj.name
  } the puppy">
      <button id="see-all">Back to all players</button>
    </div>
  `;

  playerContainer.innerHTML = pupHTML;

  let backButton = document.getElementById('see-all');
  backButton.addEventListener('click', async () => {
    const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)()
    renderAllPlayers(players)
  })
};

const renderNewPlayerForm = () => {
  let formHTML = `
    <form>
      <label for="name">Name:</label>
      <input type="text" name="name" />
      <label for="breed">Breed:</label>
      <input type="text" name="breed" />
      <button type="submit">Submit</button>
    </form>
  `;
  newPlayerFormContainer.innerHTML = formHTML;

  let form = document.querySelector('#new-player-form > form');
  form.addEventListener('submit', async (event) => {
    
    event.preventDefault();

    let playerData = {
      name: form.elements.name.value,
      breed: form.elements.breed.value
    }
    await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.addNewPlayer)(playerData);
    const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)();
    renderAllPlayers(players);
    form.elements.name.value = '';
    form.elements.breed.value = '';
  });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ajaxHelpers */ "./client/ajaxHelpers.js");
/* harmony import */ var _renderHelpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderHelpers */ "./client/renderHelpers.js");



const init = async () => {
  const players = await (0,_ajaxHelpers__WEBPACK_IMPORTED_MODULE_0__.fetchAllPlayers)()
  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderAllPlayers)(players)

  ;(0,_renderHelpers__WEBPACK_IMPORTED_MODULE_1__.renderNewPlayerForm)()
}

init()

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9wdXBweWJvd2wtd29ya3Nob3AvLi9jbGllbnQvYWpheEhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L3JlbmRlckhlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3B1cHB5Ym93bC13b3Jrc2hvcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vcHVwcHlib3dsLXdvcmtzaG9wLy4vY2xpZW50L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0EsMkRBQTJELFdBQVc7OztBQUcvRDtBQUNQO0FBQ0Esd0NBQXdDLE9BQU87QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBLHlEQUF5RCxTQUFTO0FBQ2xFO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBOztBQUVPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRU87QUFDUDtBQUNBLHFDQUFxQyxPQUFPLFdBQVcsU0FBUztBQUNoRTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsMkRBQTJELFNBQVM7QUFDcEU7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDakU4Rjs7QUFFOUY7QUFDQTs7O0FBR087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsdUJBQXVCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFNBQVM7QUFDMUMsbUNBQW1DLE9BQU87QUFDMUM7QUFDQSxvQkFBb0IsYUFBYSxrQkFBa0IsU0FBUztBQUM1RCxnREFBZ0QsT0FBTztBQUN2RCx5Q0FBeUMsT0FBTztBQUNoRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDBCQUEwQjtBQUMzQztBQUNBO0FBQ0EsMkJBQTJCLCtEQUFpQjtBQUM1QztBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLGlCQUFpQiwwQkFBMEI7QUFDM0M7QUFDQTtBQUNBLFVBQVUsMERBQVk7QUFDdEIsMEJBQTBCLDZEQUFlO0FBQ3pDO0FBQ0EsR0FBRztBQUNILEc7QUFDQTs7QUFFTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixlQUFlO0FBQzlDLGlDQUFpQyxhQUFhO0FBQzlDO0FBQ0EsaUJBQWlCLG9EQUFvRDtBQUNyRSxrQkFBa0IsZ0JBQWdCO0FBQ2xDLGtCQUFrQixtQkFBbUI7QUFDckM7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSwwQkFBMEIsNkRBQWU7QUFDekM7QUFDQSxHQUFHO0FBQ0g7O0FBRU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSwwREFBWTtBQUN0QiwwQkFBMEIsNkRBQWU7QUFDekM7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOzs7Ozs7O1VDbEhBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSx3Rjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7Ozs7Ozs7Ozs7OztBQ04rQztBQUN3Qjs7QUFFdkU7QUFDQSx3QkFBd0IsNkRBQWU7QUFDdkMsRUFBRSxpRUFBZ0I7O0FBRWxCLEVBQUUsb0VBQW1CO0FBQ3JCOztBQUVBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFkZCB5b3VyIGNvaG9ydCBuYW1lIHRvIHRoZSBjb2hvcnROYW1lIHZhcmlhYmxlIGJlbG93LCByZXBsYWNpbmcgdGhlICdDT0hPUlQtTkFNRScgcGxhY2Vob2xkZXJcbmNvbnN0IGNvaG9ydE5hbWUgPSAnMjMwMy1mdGItZXQtd2ViLXB0Jztcbi8vIFVzZSB0aGUgQVBJVVJMIHZhcmlhYmxlIGZvciBmZXRjaCByZXF1ZXN0c1xuY29uc3QgQVBJVVJMID0gYGh0dHBzOi8vZnNhLXB1cHB5LWJvd2wuaGVyb2t1YXBwLmNvbS9hcGkvJHtjb2hvcnROYW1lfS9gO1xuXG5cbmV4cG9ydCBjb25zdCBmZXRjaEFsbFBsYXllcnMgPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElVUkx9cGxheWVyc2ApO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IHJlc3VsdC5lcnJvcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0LmRhdGEucGxheWVycztcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VoIG9oLCB0cm91YmxlIGZldGNoaW5nIHBsYXllcnMhJywgZXJyb3IpO1xuICAgICAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGZldGNoU2luZ2xlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChBUElVUkwgKyBgcGxheWVycy8ke3BsYXllcklkfWApO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIHJldHVybiByZXN1bHQuZGF0YS5wbGF5ZXI7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfVxuXG59O1xuXG5leHBvcnQgY29uc3QgYWRkTmV3UGxheWVyID0gYXN5bmMgKHBsYXllck9iaikgPT4ge1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcbiAgICAgICAgICBBUElVUkwgKyBgcGxheWVyc2AsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShcbiAgICAgICAgICAgICAgICBwbGF5ZXJPYmpcbiAgICAgICAgICAgICksXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfVxuXG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlUGxheWVyID0gYXN5bmMgKHBsYXllcklkKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgJHtBUElVUkx9L3BsYXllcnMvJHtwbGF5ZXJJZH1gLCB7XG4gICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgaWYgKHJlc3VsdC5lcnJvcikgdGhyb3cgcmVzdWx0LmVycm9yO1xuICAgICAgICByZXR1cm47XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoIGBXaG9vcHMsIHRyb3VibGUgcmVtb3ZpbmcgcGxheWVyICMke3BsYXllcklkfSBmcm9tIHRoZSByb3N0ZXIhYCwgZXJyKTtcbiAgICB9XG59O1xuIiwiaW1wb3J0IHsgcmVtb3ZlUGxheWVyLGFkZE5ld1BsYXllciwgZmV0Y2hBbGxQbGF5ZXJzLCBmZXRjaFNpbmdsZVBsYXllciB9IGZyb20gJy4vYWpheEhlbHBlcnMnO1xuXG5jb25zdCBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWxsLXBsYXllcnMtY29udGFpbmVyJyk7XG5jb25zdCBuZXdQbGF5ZXJGb3JtQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1wbGF5ZXItZm9ybScpO1xuXG5cbmV4cG9ydCBjb25zdCByZW5kZXJBbGxQbGF5ZXJzID0gKHBsYXllckxpc3QpID0+IHtcbiAgLy8gRmlyc3QgY2hlY2sgaWYgd2UgaGF2ZSBhbnkgZGF0YSBiZWZvcmUgdHJ5aW5nIHRvIHJlbmRlciBpdCFcbiAgaWYgKCFwbGF5ZXJMaXN0IHx8ICFwbGF5ZXJMaXN0Lmxlbmd0aCkge1xuICAgIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSAnPGgzPk5vIHBsYXllcnMgdG8gZGlzcGxheSE8L2gzPic7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gTG9vcCB0aHJvdWdoIHRoZSBsaXN0IG9mIHBsYXllcnMsIGFuZCBjb25zdHJ1Y3Qgc29tZSBIVE1MIHRvIGRpc3BsYXkgZWFjaCBvbmVcbiAgbGV0IHBsYXllckNvbnRhaW5lckhUTUwgPSAnJztcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwbGF5ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHVwID0gcGxheWVyTGlzdFtpXTtcbiAgICBsZXQgcHVwSFRNTCA9IGBcbiAgICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtcGxheWVyLWNhcmRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImhlYWRlci1pbmZvXCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJwdXAtdGl0bGVcIj4ke3B1cC5uYW1lfTwvcD5cbiAgICAgICAgICA8cCBjbGFzcz1cInB1cC1udW1iZXJcIj4jJHtwdXAuaWR9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGltZyBzcmM9XCIke3B1cC5pbWFnZVVybH1cIiBhbHQ9XCJwaG90byBvZiAke3B1cC5uYW1lfSB0aGUgcHVwcHlcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImRldGFpbC1idXR0b25cIiBkYXRhLWlkPSR7cHVwLmlkfT5TZWUgZGV0YWlsczwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiZGVsZXRlXCIgZGF0YS1pZD0ke3B1cC5pZH0+UmVtb3ZlIGZyb20gcm9zdGVyPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICBgO1xuICAgIHBsYXllckNvbnRhaW5lckhUTUwgKz0gcHVwSFRNTDtcbiAgfVxuXG4gIC8vIEFmdGVyIGxvb3BpbmcsIGZpbGwgdGhlIGBwbGF5ZXJDb250YWluZXJgIGRpdiB3aXRoIHRoZSBIVE1MIHdlIGNvbnN0cnVjdGVkIGFib3ZlXG4gIHBsYXllckNvbnRhaW5lci5pbm5lckhUTUwgPSBwbGF5ZXJDb250YWluZXJIVE1MO1xuXG4gIC8vIE5vdyB0aGF0IHRoZSBIVE1MIGZvciBhbGwgcGxheWVycyBoYXMgYmVlbiBhZGRlZCB0byB0aGUgRE9NLFxuICAvLyB3ZSB3YW50IHRvIGdyYWIgdGhvc2UgXCJTZWUgZGV0YWlsc1wiIGJ1dHRvbnMgb24gZWFjaCBwbGF5ZXJcbiAgLy8gYW5kIGF0dGFjaCBhIGNsaWNrIGhhbmRsZXIgdG8gZWFjaCBvbmVcbiAgbGV0IGRldGFpbEJ1dHRvbnMgPSBbLi4uZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGV0YWlsLWJ1dHRvbicpXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXRhaWxCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYnV0dG9uID0gZGV0YWlsQnV0dG9uc1tpXTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmZXRjaFNpbmdsZVBsYXllcihidXR0b24uZGF0YXNldC5pZCk7XG4gICAgICByZW5kZXJTaW5nbGVQbGF5ZXIocmVzdWx0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxldCBkZWxldGVCdXR0b25zID0gWy4uLmRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2RlbGV0ZScpXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWxldGVCdXR0b25zLmxlbmd0aDsgaSsrKSB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRlbGV0ZUJ1dHRvbnNbaV07XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFzeW5jICgpID0+IHtcbiAgICBhd2FpdCByZW1vdmVQbGF5ZXIoYnV0dG9uLmRhdGFzZXQuaWQpO1xuICAgIGNvbnN0IHBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKTtcbiAgICByZW5kZXJBbGxQbGF5ZXJzKHBsYXllcnMpO1xuICB9KTtcbiAgfSBcbn07XG5cbmV4cG9ydCBjb25zdCByZW5kZXJTaW5nbGVQbGF5ZXIgPSAocGxheWVyT2JqKSA9PiB7XG4gIGlmICghcGxheWVyT2JqIHx8ICFwbGF5ZXJPYmouaWQpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gXCI8aDM+Q291bGRuJ3QgZmluZCBkYXRhIGZvciB0aGlzIHBsYXllciE8L2gzPlwiO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBwdXBIVE1MID0gYFxuICAgIDxkaXYgY2xhc3M9XCJzaW5nbGUtcGxheWVyLXZpZXdcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJoZWFkZXItaW5mb1wiPlxuICAgICAgICA8cCBjbGFzcz1cInB1cC10aXRsZVwiPiR7cGxheWVyT2JqLm5hbWV9PC9wPlxuICAgICAgICA8cCBjbGFzcz1cInB1cC1udW1iZXJcIj4jJHtwbGF5ZXJPYmouaWR9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8cD5UZWFtOiAke3BsYXllck9iai50ZWFtID8gcGxheWVyT2JqLnRlYW0ubmFtZSA6ICdVbmFzc2lnbmVkJ308L3A+XG4gICAgICA8cD5CcmVlZDogJHtwbGF5ZXJPYmouYnJlZWR9PC9wPlxuICAgICAgPGltZyBzcmM9XCIke3BsYXllck9iai5pbWFnZVVybH1cIiBhbHQ9XCJwaG90byBvZiAke1xuICAgIHBsYXllck9iai5uYW1lXG4gIH0gdGhlIHB1cHB5XCI+XG4gICAgICA8YnV0dG9uIGlkPVwic2VlLWFsbFwiPkJhY2sgdG8gYWxsIHBsYXllcnM8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgYDtcblxuICBwbGF5ZXJDb250YWluZXIuaW5uZXJIVE1MID0gcHVwSFRNTDtcblxuICBsZXQgYmFja0J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWUtYWxsJyk7XG4gIGJhY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcGxheWVycyA9IGF3YWl0IGZldGNoQWxsUGxheWVycygpXG4gICAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKVxuICB9KVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlck5ld1BsYXllckZvcm0gPSAoKSA9PiB7XG4gIGxldCBmb3JtSFRNTCA9IGBcbiAgICA8Zm9ybT5cbiAgICAgIDxsYWJlbCBmb3I9XCJuYW1lXCI+TmFtZTo8L2xhYmVsPlxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIm5hbWVcIiAvPlxuICAgICAgPGxhYmVsIGZvcj1cImJyZWVkXCI+QnJlZWQ6PC9sYWJlbD5cbiAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJicmVlZFwiIC8+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIj5TdWJtaXQ8L2J1dHRvbj5cbiAgICA8L2Zvcm0+XG4gIGA7XG4gIG5ld1BsYXllckZvcm1Db250YWluZXIuaW5uZXJIVE1MID0gZm9ybUhUTUw7XG5cbiAgbGV0IGZvcm0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmV3LXBsYXllci1mb3JtID4gZm9ybScpO1xuICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFzeW5jIChldmVudCkgPT4ge1xuICAgIFxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBsZXQgcGxheWVyRGF0YSA9IHtcbiAgICAgIG5hbWU6IGZvcm0uZWxlbWVudHMubmFtZS52YWx1ZSxcbiAgICAgIGJyZWVkOiBmb3JtLmVsZW1lbnRzLmJyZWVkLnZhbHVlXG4gICAgfVxuICAgIGF3YWl0IGFkZE5ld1BsYXllcihwbGF5ZXJEYXRhKTtcbiAgICBjb25zdCBwbGF5ZXJzID0gYXdhaXQgZmV0Y2hBbGxQbGF5ZXJzKCk7XG4gICAgcmVuZGVyQWxsUGxheWVycyhwbGF5ZXJzKTtcbiAgICBmb3JtLmVsZW1lbnRzLm5hbWUudmFsdWUgPSAnJztcbiAgICBmb3JtLmVsZW1lbnRzLmJyZWVkLnZhbHVlID0gJyc7XG4gIH0pO1xufTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgZmV0Y2hBbGxQbGF5ZXJzIH0gZnJvbSAnLi9hamF4SGVscGVycydcbmltcG9ydCB7IHJlbmRlckFsbFBsYXllcnMsIHJlbmRlck5ld1BsYXllckZvcm0gfSBmcm9tICcuL3JlbmRlckhlbHBlcnMnXG5cbmNvbnN0IGluaXQgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IHBsYXllcnMgPSBhd2FpdCBmZXRjaEFsbFBsYXllcnMoKVxuICByZW5kZXJBbGxQbGF5ZXJzKHBsYXllcnMpXG5cbiAgcmVuZGVyTmV3UGxheWVyRm9ybSgpXG59XG5cbmluaXQoKVxuIl0sInNvdXJjZVJvb3QiOiIifQ==