import React, { Component } from "react";
import ReactPlayer from "react-player";

// Utilities
import {
  getDate,
  getSources,
  getSourceNames,
  getDelayedSourceNames,
  toggleColour,
} from "./utils";

// Styles
import "./App.css";

class App extends Component {
  state = {
    url: null,
    currentIndex: 0,
    urls: null,
    showForward: true,
    showBackward: false,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  };

  load = (url) => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing });
  };

  handleStop = () => {
    this.setState({ playing: false });
    this.player.seekTo(0);
  };

  handleToggleLight = () => {
    this.setState({ light: !this.state.light });
  };

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  };

  handleVolumeChange = (e) => {
    this.setState({ volume: parseFloat(e.target.value) });
  };

  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted });
  };

  handleSetPlaybackRate = (e) => {
    this.setState({ playbackRate: parseFloat(e.target.value) });
  };

  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip });
  };

  handlePlay = () => {
    this.setState({ playing: true });
  };

  handleEnablePIP = () => {
    this.setState({ pip: true });
  };

  handleDisablePIP = () => {
    this.setState({ pip: false });
  };

  handlePause = () => {
    this.setState({ playing: false });
  };

  handleSeekMouseDown = (e) => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (e) => {
    this.setState({ played: parseFloat(e.target.value) });
  };

  handleSeekMouseUp = (e) => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  };

  handleProgress = (state) => {
    // Only update time slider if not currently seeking
    if (!this.state.seeking) {
      this.setState(state);
    }
  };

  handleEnded = () => {
    this.setState({ playing: this.state.loop });
  };

  handleDuration = (duration) => {
    this.setState({ duration });
  };

  ref = (player) => {
    this.player = player;
  };

  getDateTitle = () => {
    const { date, year, dayBehindMonth, dayBehindToday } = getDate();
    const sourceNames = getSourceNames();
    const delayedSourceNames = getDelayedSourceNames();

    let audioDate = date.toString();
    if (delayedSourceNames.includes(sourceNames[this.state.currentIndex])) {
      audioDate = year + "-" + dayBehindMonth + "-" + dayBehindToday;
    }

    return `${audioDate}`;
  };

  getTitle = () => {
    const sourceNames = getSourceNames();
    return sourceNames[this.state.currentIndex];
  };

  loadInitial = () => {
    this.load(this.state.urls[0]);
  };

  componentDidMount() {
    this.setState(
      {
        urls: getSources(),
      },
      this.loadInitial
    );
  }

  handleBackward = () => {
    const { urls, currentIndex } = this.state;

    if (
      (currentIndex > urls.length && currentIndex !== urls.length) ||
      currentIndex > 0
    ) {
      this.load(urls[currentIndex - 1]);
      if (currentIndex - 1 === 0) {
        this.setState({ showBackward: false });
      }
      this.setState({ currentIndex: currentIndex - 1, showForward: true });
    } else {
      this.setState({ showBackward: false });
      this.setState({ showForward: true });
    }
  };

  handleForward = () => {
    const { urls, currentIndex } = this.state;

    if (
      (currentIndex < urls.length && currentIndex + 1 !== urls.length) ||
      currentIndex < 0
    ) {
      this.load(urls[currentIndex + 1]);
      if (currentIndex + 1 === urls.length - 1) {
        this.setState({ showForward: false });
      }
      this.setState({ currentIndex: currentIndex + 1, showBackward: true });
    } else {
      this.setState({ showBackward: true });
      this.setState({ showForward: false });
    }
  };

  render() {
    const {
      url,
      showForward,
      showBackward,
      playing,
      controls,
      light,
      loop,
      played,
      playbackRate,
    } = this.state;

    return (
      <div role="main" className="app">
        <section className="section">
          <div className="player-wrapper">
            <ReactPlayer
              ref={this.ref}
              className="react-player"
              width="100%"
              height="100%"
              url={url}
              config={{
                file: {
                  forceAudio: true,
                },
              }}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              onEnded={this.handleEnded}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
            />
          </div>

          <button id="toggle-colour" onClick={toggleColour}>
            Change Colour
          </button>

          <h2 id="date" className="title">
            {this.getDateTitle()}
          </h2>

          <h1 id="reading" className="title">
            {this.getTitle()}
          </h1>

          <div id="media-controls">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={this.handleSeekMouseDown}
              onChange={this.handleSeekChange}
              onMouseUp={this.handleSeekMouseUp}
              aria-label="Seeker"
            />

            <button
              className={`button ${showBackward ? "" : "hide"}`}
              onClick={this.handleBackward}
              aria-label="Skip Backward"
            >
              <i className="fa fa-fast-backward"></i>
            </button>

            <button
              className="button"
              onClick={this.handleStop}
              aria-label="Stop"
            >
              <i className="fa fa-stop"></i>
            </button>

            <button
              className="button"
              onClick={this.handlePlayPause}
              aria-label="Toggle Play/Pause"
            >
              {playing ? (
                <i className="fa fa-pause"></i>
              ) : (
                <i className="fa fa-play"></i>
              )}
            </button>

            <button
              className={`button ${showForward ? "" : "hide"}`}
              onClick={this.handleForward}
              aria-label="Skip Forward"
            >
              <i className="fa fa-fast-forward"></i>
            </button>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
