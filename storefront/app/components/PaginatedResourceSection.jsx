import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection> encapsulates the previous and next pagination behaviors throughout your application.
 * @param {Class<Pagination<NodesType>>['connection']>}
 */
export function PaginatedResourceSection({
  connection,
  children,
  ariaLabel,
  resourcesClassName,
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <div className="tx-pagination">
              <PreviousLink className="tx-pagination__link">
                {isLoading ? (
                  'Cargando…'
                ) : (
                  <span>
                    <span aria-hidden="true">↑</span> Cargar anteriores
                  </span>
                )}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div
                aria-label={ariaLabel}
                className={resourcesClassName}
                role={ariaLabel ? 'region' : undefined}
              >
                {resourcesMarkup}
              </div>
            ) : (
              resourcesMarkup
            )}
            <div className="tx-pagination">
              <NextLink className="tx-pagination__link">
                {isLoading ? (
                  'Cargando…'
                ) : (
                  <span>
                    Cargar más <span aria-hidden="true">↓</span>
                  </span>
                )}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
