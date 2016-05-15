import React from 'react'
import { Image, Button, ButtonInput, Modal, } from 'react-bootstrap';
import auth from '../../../util/authHelpers.js'
import RestHandler from '../../../util/RestHandler'
var Dropzone = require('react-dropzone');

//unique photo string: http://stackoverflow.com/questions/1077041
class ProfileImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUserId: -1,
      permission: 1,
      editModal: false,
      uniquePhotoString: ''
    }
  }

  showEditModal() {
    this.setState({ editModal: true });
  };
  hideEditModal(saved) {
    this.setState({ editModal: false });
    if(saved) {
      this.setState({ uniquePhotoString: '?' + new Date().getTime()});
    }
  };

  componentDidMount() {
    this.getLoggedInUserData();
  }

  getLoggedInUserData() {
    //gets the authentication token from util/authHelpers.js
    //and retrieves permission and user id
    // auth.parseJwtAsync((parsedToken) => {
    //   if(parsedToken) {
    //     this.setState({
    //       loggedInUserId: parsedToken.iss,
    //       permission: parsedToken.perm
    //     });
    //   }
    // });
  }


  renderImage() {
    var uniquePhotoString = this.state.uniquePhotoString || '';
    if(this.state.permission === 1 || this.props.profilesUserId === this.state.loggedInUserId) {
      if(this.props.editing) {
        return (
          <div>
            <Button
              bsStyle="link"
              className="change-image-button"
              onClick={this.showEditModal.bind(this)}>
              <Image src={`${this.props.src}${uniquePhotoString}`} responsive />
              <div className="label-overlay">Change image ✎</div>
            </Button>
           </div>
        )
      } else {
        return(
          <div>
            <Image src={`${this.props.src}${uniquePhotoString}`} responsive />
          </div>
        )
      }
    }
    else {
      return (
        <Image src={`${this.props.src}${uniquePhotoString}`} responsive />
      )
    }
  }

  render() {
    return (
      <div>
        <SelectImageModal imageUrl={this.props.src}  show={this.state.editModal} onHide={this.hideEditModal.bind(this, true)} />
        {this.renderImage()}
      </div>
    );
  }
}


class SelectImageModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedImage: undefined,
    }
  }

  onDrop(files) {
    const fileName = this.props.imageUrl;
    const file = files[0];
    const data = new FormData()
    data.append('fileName', fileName);
    data.append('photo', file);
    RestHandler.Post('user/uploadimage', data, (err, res) => {
      if(err) {
        console.log(err)
      } else {
        console.log(res);
        this.props.onHide()
      }
    });
   }

  render() {
    console.log(this.props);
    return (
      <Modal {...this.props} aria-labelledby="contained-modal-title-md">

        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-md">Change profile image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Dropzone
              disablePreview
              onDrop={this.onDrop.bind(this)}
              className="dropzone"
              activeClassName="dropzone-active"
              >
              <div>Drop an image file here <br /> or select an image</div>
            </Dropzone>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
};



module.exports = ProfileImage;
