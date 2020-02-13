var currentSong;
var skipCount = 0;
var users = [];

async function skipTrack(mopidy, options, user) {
  const userCheck = multipleVoteCheck(user);
  if (userCheck !== undefined) {
    return userCheck;
  }
  await resetVarsCheck(mopidy).catch();
  return voteCountCheck(mopidy);
}

function multipleVoteCheck(user) {
  if (users.includes(user)) {
    return "Sorry mate this is a democracy, not a dictatorship.";
  } else {
    users.push(user);
  }
}

async function resetVarsCheck(mopidy) {
  const track = await mopidy.playback.getCurrentTrack();

  if (currentSong === undefined) {
    currentSong === (await mopidy.playback.getCurrentTrack());
    console.log(currentSong);
    console.log(track);
  } else if (currentSong.name !== track.name) {
    currentSong = undefined;
    skipCount = 0;
    users = [];
  }
}

async function voteCountCheck(mopidy) {
  console.log("hit 3");
  if (skipCount === 0) {
    skipCount++;
    currentSong = await mopidy.playback.getCurrentTrack();
    const count = 3 - skipCount;
    return "" + count + " more skips needed.";
  } else if (skipCount < 2) {
    skipCount++;
    const count = 3 - skipCount;
    return "" + count + " more skips needed.";
  } else {
    mopidy.playback.next();
    return "Okay then, I hope that wasn't an absolute *_tune and a half!_*";
  }
}

module.exports.skipTrack = skipTrack;