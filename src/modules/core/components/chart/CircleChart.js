import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as Helpers from 'common/utils/helpers';

import './styles.scss';

// http://tauday.com/tau-manifesto
const tau = 2 * Math.PI;

/**
 * Using D3 for this customization
 * Refer: http://bl.ocks.org/mbostock/5100636
 * API documentation: https://github.com/d3/d3/blob/master/API.md
 */
export class CircleChart extends React.Component {
  constructor(props) {
    super(props);

    this.charId = Helpers.guid();
  }

  componentDidMount() {
    this.configureChart();
  }

  componentWillUpdate(nextProps) {
    const { angel } = this.props;

    if (angel !== nextProps.angel) {
      if (this.text) {
        this.text.text(`${parseFloat(nextProps.angel * 100).toFixed(0)}%`);
      }

      // Returns a tween for a transition’s "d" attribute, transitioning any selected
      // arcs from their current angle to the specified new angle.
      this.performTransition(nextProps.angel);
    }
  }

  performTransition(angel) {
    // Returns a tween for a transition’s "d" attribute, transitioning any selected
    // arcs from their current angle to the specified new angle.
    this.foreground.transition()
      .duration(750)
      .attrTween('d', (() => {
        return (d) => {
          let interpolate = d3.interpolate(d.endAngle, angel * tau);

          return (t) => {
            d.endAngle = interpolate(t);

            return this.arc(d);
          };
        };
      })());
  }

  configureChart() {
    const { innerRadius, outerRadius, angel } = this.props;

    // An arc function with all values bound except the endAngle. So, to compute an
    // SVG path string for a given angle, we pass an object with an endAngle
    // property to the `arc` function, and it will return the corresponding string.
    this.arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0);

    let arcInner = d3.arc()
      .innerRadius(innerRadius - 5)
      .outerRadius(innerRadius)
      .startAngle(0);

    // Get the SVG container, and apply a transform such that the origin is the
    // center of the canvas. This way, we don’t need to position arcs individually.
    let svg = d3.select(`#circle-${this.charId}`);
    let width = svg.attr('width');
    let height = svg.attr('height');
    let g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    /* For the drop shadow filter... */
    let defs = svg.append('defs');

    let filter = defs.append('filter')
      .attr('id', 'dropshadow');

    filter.append('feGaussianBlur')
      .attr('in', 'SourceAlpha')
      .attr('stdDeviation', 8);
    filter.append('feOffset')
      .attr('in', 'blur')
      .attr('dx', 0)
      .attr('dy', 0)
      .attr('result', 'offsetBlur');
    filter.append('feFlood')
      .attr('flood-color', '#f58220')
      .attr('flood-opacity', 0.5)
      .attr('result', 'offsetColor');
    filter.append('feComposite')
      .attr('in', 'offsetColor')
      .attr('in2', 'offsetBlur')
      .attr('result', 'offsetBlur')
      .attr('operator', 'in');

    let feMerge = filter.append('feMerge');

    feMerge.append('feMergeNode')
      .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
      .attr('in', 'SourceGraphic');

    // Add the background arc, from 0 to 100% (tau).
    g.append('path')
      .datum({ endAngle: tau })
      .style('fill', '#ffdbbb')
      .attr('d', arcInner)
      .attr('filter', 'url(#dropshadow)');

    // Add the foreground arc in orange, currently showing 12.7%.
    this.foreground = g.append('path')
      .datum({ endAngle: 0 })
      .style('fill', '#f58220')
      .attr('d', this.arc);

    // Add empty circle to hide shadow affect from filter inner
    g.append('circle')
      .attr('r', innerRadius - 5)
      .attr('fill', 'white');

    // Add percentage into circle
    this.text = g.append('text')
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .text(`${parseFloat(angel * 100).toFixed(0)}%`)
      .attr('font-size', '60')
      .attr('color', '#333');

    // Returns a tween for a transition’s "d" attribute, transitioning any selected
    // arcs from their current angle to the specified new angle.
    this.performTransition(angel);
  }

  render() {
    const { height, width } = this.props;

    return (
      <div className='circle-chart-wrapper'>
        <svg
          id={`circle-${this.charId}`}
          height={height}
          width={width} />
      </div>
    );
  }
}

/**
 * Typechecking With PropTypes
 * Reference https://facebook.github.io/react/docs/typechecking-with-proptypes.html
 * Proptypes: https://github.com/facebook/prop-types
 */
CircleChart.propTypes = {
  angel: PropTypes.number,
  height: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  width: PropTypes.number
};

