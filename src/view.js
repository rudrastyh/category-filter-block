/**
 * WordPress dependencies
 */
import { store, getElement } from '@wordpress/interactivity';

store( 'rudr', {
	actions: {
		*navigate( event ) {

			// https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/src/query-pagination-next/index.php
			const { ref } = getElement();

			const url = ref.value

			const { actions } = yield import(
				'@wordpress/interactivity-router'
			);

			yield actions.navigate( url );

		},
		onchange( event ) {

			const { ref } = getElement();

			const url = ref.value

			window.location.assign( url )

		},
		// for links we can just use the default core/query::actions.navigate action
	}
} );
