import React, { Component } from "react";
import { tableService } from "../services/tableService";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InfiniteScroll from "react-infinite-scroller";
import CircularProgress from "@material-ui/core/CircularProgress";

export default class VideoTable extends Component {
  state = {
    videos: [],
    filteredVideos: null,
    viewsOrder: "asc",
    likesOrder: "asc",
    shareOrder: "asc",
    page: 1,
    videosPerPage: 10,
    more: true
  };

  componentDidMount() {
    var { page, videosPerPage } = this.state;
    // tableService(page, videosPerPage).then(data => {
    //   console.log(data);
    //   this.setState({
    //     videos: data.videos,
    //     filteredVideos: data.videos.slice(0, page * videosPerPage),
    //     total_pages: Math.ceil(data.total / this.state.videosPerPage)
    //   });
    // });

    var data = tableService(page, videosPerPage);
    this.setState({
      videos: data.videos,
      filteredVideos: data.videos.slice(0, page * videosPerPage),
      total_pages: Math.ceil(data.total / this.state.videosPerPage)
    });
  }

  filter = name => event => {
    var filteredVideos = this.state.videos.filter(video => {
      return video[name]
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
    });
    this.setState({ filteredVideos });
  };

  fetchMoreData = () => {
    var { page, videosPerPage, filteredVideos, total_pages } = this.state;
    if (page <= total_pages) {
      this.setState({ page: this.state.page + 1 }, () => {
        var data = tableService(this.state.page, videosPerPage);
        filteredVideos = filteredVideos.concat(data.videos);
        this.setState({ filteredVideos });
      });
    } else {
      this.setState({ more: false }, console.log("false"));
    }
  };
  handleSortClick = (name, order) => event => {
    switch (name) {
      case "views":
        this.state.viewsOrder === "asc"
          ? this.setState({ viewsOrder: "desc" })
          : this.setState({ viewsOrder: "asc" });
        break;
      case "shares":
        this.state.shareOrder === "asc"
          ? this.setState({ shareOrder: "desc" })
          : this.setState({ shareOrder: "asc" });
        break;
      case "likes":
        this.state.likesOrder === "asc"
          ? this.setState({ likesOrder: "desc" })
          : this.setState({ likesOrder: "asc" });
        break;
      default:
        break;
    }
    this.sort(name, order);
  };

  sort = (name, order) => {
    var filteredVideos = this.state.filteredVideos;
    order === "desc"
      ? filteredVideos.sort((a, b) => (b[name] < a[name] ? -1 : 1))
      : filteredVideos.sort((a, b) => (a[name] < b[name] ? -1 : 1));

    this.setState({ filteredVideos });
  };

  renderTitleFilter = () => {
    return (
      <TextField
        className="filter"
        id="input-with-icon-textfield"
        label="filter by video title"
        onChange={this.filter("title")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    );
  };
  renderPageFilter = () => {
    return (
      <TextField
        className="filter"
        onChange={this.filter("parent_name")}
        id="input-with-icon-textfield"
        label="filter by page name"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
      />
    );
  };
  renderTable() {
    return (
      <Paper className="table">
        {this.renderTitleFilter()}
        {this.renderPageFilter()}
        {this.state.filteredVideos && (
          <Table className="table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Page Name</TableCell>
                <TableCell>Publish date</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={true}
                    direction={this.state.viewsOrder}
                    onClick={this.handleSortClick(
                      "views",
                      this.state.viewsOrder
                    )}
                  >
                    Views
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={true}
                    direction={this.state.likesOrder}
                    onClick={this.handleSortClick(
                      "likes",
                      this.state.likesOrder
                    )}
                  >
                    likes
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={true}
                    direction={this.state.shareOrder}
                    onClick={this.handleSortClick(
                      "shares",
                      this.state.shareOrder
                    )}
                  >
                    Shares
                  </TableSortLabel>
                </TableCell>
                <TableCell>Comments</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.filteredVideos.map((video, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {video.title}
                    </TableCell>
                    <TableCell>{video.parent_name}</TableCell>
                    <TableCell>{video.published}</TableCell>
                    <TableCell>{video.views}</TableCell>
                    <TableCell>{video.likes}</TableCell>
                    <TableCell>{video.comments}</TableCell>
                    <TableCell>{video.shares}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        {this.state.filteredVideos &&
          !this.state.filteredVideos.length && (
            <p className="result">No result found</p>
          )}
      </Paper>
    );
  }

  render() {
    return (
      <div>
        {this.state.videos.length > 0 && (
          <InfiniteScroll
            pageStart={0}
            loadMore={this.fetchMoreData}
            hasMore={this.state.more}
            loader={
              <div key={0} className="loader">
                <CircularProgress size={100} />
              </div>
            }
          >
            {this.renderTable()}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}
