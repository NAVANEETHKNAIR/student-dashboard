import React from 'react';
import { connect } from 'react-redux';

import withClassPrefix from 'utils/class-prefix';
import { closeSurveyModal, updateSurveyAnswer, submitSurvey } from 'state/survey-modal';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'components/modal';

import Icon from 'components/icon';

export class SurveyModal extends React.Component {
  constructor() {
    super();

    this.state = {
      wasSuccess: false,
      wasFailure: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  renderSubmitIcon() {
    let name = 'send';
    let className = '';

    if (this.props.submitting) {
      name = 'circle-o-notch';
      className = 'fa-spin';
    } else if (this.state.wasFailure) {
      name = 'times';
    } else if (this.state.wasSuccess) {
      name = 'check';
    }

    return <Icon name={name} className={className} />;
  }

  renderSubmitText() {
    if (this.props.submitting) {
      return 'Lähetetään vastaustasi...';
    } else if (this.state.wasFailure) {
      return 'Vastaustasi ei pystytty lähettämään';
    } else if (this.state.wasSuccess) {
      return 'Vastauksesi on lähetetty';
    } else {
      return 'Lähetä vastauksesi';
    }
  }

  componentWillReceiveProps(nextProps) {
    const isTransitioning = this.props.submitting === true && nextProps.submitting === false;

    if (isTransitioning && nextProps.error) {
      this.setState({
        wasFailure: true,
      });
    } else if (isTransitioning) {
      this.setState({
        wasSuccess: true,
      });
    }

    if(this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      if (this.state.wasSuccess) {
        this.props.onClose();
      }

      this.setState({
        wasSuccess: false,
        wasFailure: false,
      });
    }, 2000);
  }

  renderBody() {
    return (
      <div className={withClassPrefix('survey-modal')}>
        <p>
          Tämä kysely liittyy visualisaatioon, jonka olet nähnyt tämän materiaalin oikeassa alalaidassa (<Icon name="line-chart" /> ikonin takana). <strong>Tutkimuksemme kannalta olisi erittäin tärkeää, jos ehtisit vastata tähän lyhyeen kyselyyn visualisaatioon liittyen</strong>.
        </p>

        <p>
          Tässä kyselyssä ei ole oikeita tai vääriä vastauksia, vastaa niin tarkasti kuin pystyt. Käytä alla määriteltyä skaalaa vastausten antamiseen. <strong>Jos olet sitä mieltä, että väite pätee sinuun erittäin hyvin, valitse 7</strong>; <strong>jos olet sitä mieltä, että väite ei päde sinuun lainkaan, valitse 1</strong>. Jos väite on enemmän tai vähemmän totta kohdallasi, valitse sinua parhaiten kuvaava arvo lukujen 1 ja 7 väliltä.
        </p>

        <div className={withClassPrefix('survey-modal__item-list')}>
          {this.renderItem(<span>Visualisaatio oli mielestäni hyödyllinen</span>, { id: 'q1' })}
          {this.renderItem(<span>Visualisaatiota oli mielestäni helppo käyttää</span>, { id: 'q2' })}
          {this.renderItem(<span>Visualisaatiota oli mielestäni helppo tulkita</span>, { id: 'q3' })}
          {this.renderItem(<span>Visualisaatio <strong>ei</strong> motivoinut minua edistymään kurssissa</span>, { id: 'q4' })}
          {this.renderItem(<span>Visualisaatio motivoi minua tekemään enemmän tehtäviä</span>, { id: 'q5' })}
          {this.renderItem(<span>Visualisaatio <strong>ei</strong> motivoinut minua aikaistamaan tehtävien tekoa</span>, { id: 'q6' })}
          {this.renderItem(<span>Visualisaatio motivoi minua jakamaan tehtävien työmäärää tasaisesti</span>, { id: 'q7' })}
          {this.renderItem(<span>Visualisaatio motivoi minua pärjäämään paremmin kuin muut</span>, { id: 'q8' })}
          {this.renderItem(<span>Visualisaatio motivoi minua oppimaan enemmän</span>, { id: 'q9' })}
          {this.renderItem(<span>Visualisaatio <strong>ei</strong> häirinnyt materiaalin lukuani</span>, { id: 'q10' })}
          {this.renderItem(<span>Visualisaatio aiheutti minulle ahdistusta</span>, { id: 'q11' })}
        </div>
      </div>
    );
  }

  getNumberOfAnswers() {
    return Object.keys(this.props.answers || {}).length;
  }

  getNumberOfItems() {
    return 11;
  }

  isValidSurvey() {
    return this.getNumberOfAnswers() === this.getNumberOfItems();
  }

  submitIsDisabled() {
    return !this.isValidSurvey() || this.props.submitting || this.state.wasFailure || this.state.wasSuccess;
  }

  itemHasAnswerWith({ id, value }) {
    return (this.props.answers || {})[id] === value;
  }

  renderScaleValues({ id }) {
    const values = new Array(7).fill(null);

    return values
      .map((value, index) => {
        return (
          <div className={withClassPrefix('survey-modal__scale-value')} key={`${id}-${index}`}>
            <label className={withClassPrefix('survey-modal__scale-value-label')}>
              {index + 1}
              <input
                type="radio"
                name={id}
                value={index + 1}
                checked={this.itemHasAnswerWith({ id, value: index + 1 })}
                className={withClassPrefix('survey-modal__scale-value-radio')}
                onChange={() => this.props.onAnswerChange({ id, value: index + 1 })}
              />
            </label>
          </div>
        );
      });
  }

  renderLegend() {
    return (
      <div className={withClassPrefix('survey-modal__item-legend')}>
        <div className={withClassPrefix('survey-modal__legend-min')}>
          Täysin eri mieltä
        </div>

        <div className={withClassPrefix('survey-modal__legend-max')}>
          Täysin samaa mieltä
        </div>
      </div>
    );
  }

  renderItem(title, { id }) {
    return (
      <div className={withClassPrefix('survey-modal__item')} key={id}>
        {this.renderLegend()}

        <div className={withClassPrefix('survey-modal__item-title')}>
          {title}
        </div>
        <div className={withClassPrefix('survey-modal__item-scale')}>
          {this.renderScaleValues({ id })}
        </div>
      </div>
    );
  }

  renderFooter() {
    return (
      <div>
        <button className={withClassPrefix('btn btn-success btn-icon')} disabled={this.submitIsDisabled()} onClick={this.onSubmit}>
          {this.renderSubmitIcon()}
          {' '}
          {this.renderSubmitText()}
        </button>
      </div>
    );
  }

  onSubmit() {
    if(!this.submitIsDisabled()) {
      this.props.onSubmit();
    }
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} onClose={this.props.onClose}>
        <ModalHeader onClose={this.props.onClose}>
          Visualisaatioon liittyvä kysely <span className={withClassPrefix('text-muted text-size-base text-weight-normal')}>{this.getNumberOfAnswers()} / {this.getNumberOfItems()} kohtaan vastattu.</span>
        </ModalHeader>
        <ModalBody>
          {this.renderBody()}
        </ModalBody>
        <ModalFooter>
          {this.renderFooter()}
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.surveyModal.isOpen,
  answers: state.surveyModal.answers,
  submitting: state.surveyModal.submitting,
  error: state.surveyModal.error,
});

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeSurveyModal()),
  onSubmit: () => dispatch(submitSurvey()),
  onAnswerChange: ({ id, value }) => dispatch(updateSurveyAnswer({ id, value })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SurveyModal);
