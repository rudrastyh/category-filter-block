import classnames from 'classnames';

import { __ } from '@wordpress/i18n';

import {
  useBlockProps,
  BlockControls,
  InspectorControls,
  AlignmentToolbar,
} from '@wordpress/block-editor';

import {
	SelectControl,
	PanelBody,
  TextControl,
  ToggleControl,
  // filter type selector
  __experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';

import apiFetch from '@wordpress/api-fetch';

import { addQueryArgs } from '@wordpress/url'


export default function Edit( { attributes, setAttributes, style } ){

  const classes = classnames( {
    [ `rudr-category-filter--${ attributes.filterType }` ] : true,
    // text align controls
    [ `has-text-align-${ attributes.textAlign }` ] : 'buttons' !== attributes.filterType && attributes.textAlign,
  } )

  const styles = { ... style }

	const blockProps = useBlockProps( {
    className: classes,
    style: styles
  } );

  // terms for the block
  const [ terms, setTerms ]       = useState( null );
  const [ isLoaded, setIsLoaded ] = useState( false );

  useEffect( () => {
    apiFetch( {
      path: addQueryArgs(
        `/wp/v2/categories`,
        {
          hide_empty: true
        }
      )
    } ).then(
      ( result ) => {
        setIsLoaded( true );
        setTerms( result );
      },
      ( error ) => {
        setIsLoaded( true );
      }
    );
  }, [] );

	return (
    <>
      <BlockControls group="block">
        <AlignmentToolbar
					value={ attributes.textAlign }
					onChange={ ( alignment ) => {
						setAttributes( { textAlign: alignment } )
					} }
				/>
      </BlockControls>
      <InspectorControls>
  			<PanelBody title={ __( 'Settings' ) } initialOpen={ true }>

          <ToggleGroupControl
            label={ __( 'Filter type', 'category-filter-block' ) }
            value={ attributes.filterType }
		        onChange={ ( filterType ) => setAttributes( { filterType } ) }
            isBlock
          >
             <ToggleGroupControlOption value="dropdown" label={ __( 'Dropdown', 'category-filter-block' ) } />
             <ToggleGroupControlOption value="links" label={ __( 'Links', 'category-filter-block' ) } />
          </ToggleGroupControl>

          <SelectControl
            label={ __( 'Taxonomy (PRO VERSION)' ) }
            value="category"
            options={ [
              { label: __( 'Category', 'category-filter-block' ), value: 'category', disabled: true }
            ] }
            __nextHasNoMarginBottom
          />

          <ToggleControl
            label={ __( 'Show post counts' ) }
            checked={ attributes.showCount }
            onChange={ () => setAttributes( { showCount: ! attributes.showCount } ) }
          />

          <TextControl
            label={ __( 'All items text', 'category-filter-block' ) }
            value={ attributes.allItemsText }
            onChange={ ( allItemsText ) => setAttributes( { allItemsText } ) }
          />

          <SelectControl
            label={ __( 'Order by (PRO VERSION)' ) }
            value="name"
            options={ [
              { label : __( 'A → Z' ), value: 'name', disabled: true }
            ] }
            __nextHasNoMarginBottom
          />

        </PanelBody>

  		</InspectorControls>
  		<div { ...blockProps }>
        {
          ! isLoaded && <span>{ __( 'Loading...', 'category-filter-block' ) }</span>
        }

        {
          isLoaded && terms && 'dropdown' === attributes.filterType &&
    			<select>
            <option>{ attributes.allItemsText || 'All categories' }</option>
            {
              terms.map( (row, index) => {
                const termName = attributes.showCount ? terms[index].name + ' (' + terms[index].count + ')' : terms[index].name
                return <option value={ terms[index].id }>{ termName }</option>
              } )
            }
          </select>
        }

        {
          isLoaded && terms && 'links' === attributes.filterType &&
    			<ul>
            <li><a className="rudr-filter-current">{ attributes.allItemsText || 'All categories' }</a></li>
            {
              terms.map( (row, index) => {
                return <li><a>{ terms[index].name }</a>{ attributes.showCount && <> ({ terms[index].count})</> }</li>
              } )
            }
          </ul>
        }
  		</div>
    </>
	)
}
