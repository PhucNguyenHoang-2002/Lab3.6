import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Modal,
  Button,
  PanResponder,
  Alert,
} from "react-native";
import { Card, Image, Icon, Rating, Input } from "react-native-elements";
import { ScrollView } from "react-native-virtualized-view";
import { baseUrl } from "../shared/baseUrl";
import * as Animatable from 'react-native-animatable';


class RenderDish extends Component {
  render() {
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
      if (dx < -200) return 1; // right to left
      else if (dx > 200) return 2; // left to right
      return 0;
    };
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gestureState) => { return true; },
      onPanResponderEnd: (e, gestureState) => {
        if (recognizeDrag(gestureState) === 1) {
          Alert.alert(
            'Add Favorite',
            'Are you sure you wish to add ' + dish.name + ' to favorite?',
            [
              { text: 'Cancel', onPress: () => { /* nothing */ } },
              { text: 'OK', onPress: () => { this.props.favorite ? alert('Already favorite') : this.props.onPressFavorite() } },
            ]
          );
        } else if (recognizeDrag(gestureState) === 2) {
          this.props.onPressComment();
        }
        return true;
      }
    });

    const dish = this.props.dish;
    if (dish != null) {
      return (
        <Card {...panResponder.panHandlers}>
          {/* <Image
            source={{ uri: baseUrl + dish.image }}
            style={{
              width: "100%",
              height: 100,
              flexGrow: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image> */}
          <Image source={{ uri: baseUrl + dish.image }} style={{ width: '100%', height: 100, flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card.FeaturedTitle>{dish.name}</Card.FeaturedTitle>
          </Image>
          <Text style={{ margin: 10 }}>{dish.description}</Text>
          <Text style={{ margin: 10 }}>{dish.deion}</Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Icon
              raised
              reverse
              type="font-awesome"
              color="#f50"
              name={this.props.favorite ? "heart" : "heart-o"}
              onPress={() =>
                this.props.favorite
                  ? alert("Already favorite")
                  : this.props.onPressFavorite()
              }
            />
            <Icon
              raised
              reverse
              name="pencil"
              type="font-awesome"
              color="#512DA8"
              onPress={() => this.props.onPressComment()}
            />
          </View>
        </Card>
      );
    }
    return <View />;
  }
}

class RenderComments extends Component {
  render() {
    const comments = this.props.comments;
    return (
      <Card>
        <Card.Title>Comments</Card.Title>
        <Card.Divider />
        <FlatList
          data={comments}
          renderItem={({ item, index }) => this.renderCommentItem(item, index)}
          keyExtractor={(item) => item.id.toString()}
        />
      </Card>
    );
  }
  renderCommentItem(item, index) {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
        <Rating
          startingValue={item.rating}
          imageSize={16}
          readonly
          style={{ flexDirection: "row" }}
        />
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}{" "}
        </Text>
      </View>
    );
  }
}

// redux
import { connect } from "react-redux";
const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites,
  };
};
import { postFavorite, postComment } from "../redux/ActionCreators";
const mapDispatchToProps = (dispatch) => ({
  postFavorite: (dishId) => dispatch(postFavorite(dishId)),
  postComment: (dishId, rating, author, comment) =>
    dispatch(postComment(dishId, rating, author, comment)),
});

class ModalContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 3,
      author: "",
      comment: "",
    };
  }
  render() {
    return (
      <View style={{ justifyContent: "center", margin: 20 }}>
        <Rating
          startingValue={this.state.rating}
          showRating={true}
          onFinishRating={(value) => this.setState({ rating: value })}
        />
        <View style={{ height: 20 }} />
        <Input
          value={this.state.author}
          placeholder="Author"
          leftIcon={{ name: "user-o", type: "font-awesome" }}
          onChangeText={(text) => this.setState({ author: text })}
        />
        <Input
          value={this.state.comment}
          placeholder="Comment"
          leftIcon={{ name: "comment-o", type: "font-awesome" }}
          onChangeText={(text) => this.setState({ comment: text })}
        />
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Button
            title="SUBMIT"
            color="#7cc"
            onPress={() => this.handleSubmit()}
          />
          <View style={{ width: 10 }} />
          <Button
            title="CANCEL"
            color="#7cc"
            onPress={() => this.props.onPressCancel()}
          />
        </View>
      </View>
    );
  }
  handleSubmit() {
    //alert(this.props.dishId + ':' + this.state.rating + ':' + this.state.author + ':' + this.state.comment);
    this.props.postComment(
      this.props.dishId,
      this.state.rating,
      this.state.author,
      this.state.comment
    );
    this.props.onPressCancel();
  }
}

class Dishdetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }
  render() {
    const dishId = parseInt(this.props.route.params.dishId);
    const dish = this.props.dishes.dishes[dishId];
    const comments = this.props.comments.comments.filter(
      (cmt) => cmt.dishId === dishId
    );
    const favorite = this.props.favorites.some((el) => el === dishId);
    return (
      <ScrollView>
        <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
          <RenderDish
            dish={dish}
            favorite={favorite}
            onPressFavorite={() => this.markFavorite(dishId)}
            onPressComment={() => this.setState({ showModal: true })}
          />
        </Animatable.View>
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
          <RenderComments comments={comments} />
        </Animatable.View>
        <Modal
          animationType={"slide"}
          visible={this.state.showModal}
          onRequestClose={() => this.setState({ showModal: false })}>
          <ModalContent
            dishId={dishId}
            postComment={this.props.postComment}
            onPressCancel={() => this.setState({ showModal: false })}
          />
        </Modal>
      </ScrollView>
    );
  }
  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);
