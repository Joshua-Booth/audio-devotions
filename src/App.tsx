import { Component } from "react";
import ReactPlayer from "react-player";

import {
  getDate,
  getDelayedSourceNames,
  getSourceNames,
  getSources,
  toggleColour,
} from "./utils";

interface AppState {
  url: string | null;
  currentIndex: number;
  urls: string[] | null;
  showForward: boolean;
  showBackward: boolean;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  loop: boolean;
  seeking: boolean;
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    url: null,
    currentIndex: 0,
    urls: getSources(),
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
    seeking: false,
  };

  load = (url: string) => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false,
    });
  };

  handlePlayPause = () => {
    this.setState((prevState) => ({ playing: !prevState.playing }));
  };

  handleStop = () => {
    this.setState({ playing: false });
    if (this.player) {
      this.player.currentTime = 0;
    }
  };

  handleToggleLight = () => {
    this.setState((prevState) => ({ light: !prevState.light }));
  };

  handleToggleLoop = () => {
    this.setState((prevState) => ({ loop: !prevState.loop }));
  };

  handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ volume: Number.parseFloat(e.target.value) });
  };

  handleToggleMuted = () => {
    this.setState((prevState) => ({ muted: !prevState.muted }));
  };

  handleSetPlaybackRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ playbackRate: Number.parseFloat(e.target.value) });
  };

  handleTogglePIP = () => {
    this.setState((prevState) => ({ pip: !prevState.pip }));
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

  handleSeekMouseDown = () => {
    this.setState({ seeking: true });
  };

  handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ played: Number.parseFloat(e.target.value) });
  };

  handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    this.setState({ seeking: false });
    if (this.player) {
      this.player.currentTime =
        Number.parseFloat((e.target as HTMLInputElement).value) *
        this.player.duration;
    }
  };

  handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    // Only update time slider if not currently seeking
    if (!this.state.seeking) {
      const target = e.target as HTMLVideoElement;
      const played = target.currentTime / target.duration || 0;
      this.setState({ played });
    }
  };

  handleEnded = () => {
    this.setState((prevState) => ({ playing: prevState.loop }));
  };

  handleDurationChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const target = e.target as HTMLVideoElement;
    this.setState({ duration: target.duration });
  };

  ref = (player: HTMLVideoElement | null) => {
    this.player = player;
  };

  getDateTitle = () => {
    const { date, year, dayBehindMonth, dayBehindToday } = getDate();
    const sourceNames = getSourceNames();
    const delayedSourceNames = getDelayedSourceNames();

    let audioDate = date.toString();
    if (delayedSourceNames.includes(sourceNames[this.state.currentIndex])) {
      audioDate = `${year}-${dayBehindMonth}-${dayBehindToday}`;
    }

    return `${audioDate}`;
  };

  getTitle = () => {
    const sourceNames = getSourceNames();
    return sourceNames[this.state.currentIndex];
  };

  loadInitial = () => {
    if (this.state.urls) {
      this.load(this.state.urls[0]);
    }
  };

  player: HTMLVideoElement | null = null;

  componentDidMount() {
    this.loadInitial();
  }

  handleBackward = () => {
    const { urls, currentIndex } = this.state;

    if (!urls) return;

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

    if (!urls) return;

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
              src={url ?? undefined}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              onPlay={this.handlePlay}
              onPause={this.handlePause}
              onEnded={this.handleEnded}
              onTimeUpdate={this.handleTimeUpdate}
              onDurationChange={this.handleDurationChange}
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

            <div>
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
          </div>
        </section>
      </div>
    );
  }
}

export default App;
