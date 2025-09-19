import { onCleanup, onMount } from 'solid-js';
import type { Component } from 'solid-js';
import * as bootstrap from 'bootstrap';

const App: Component = () => {
  /**
   * This function was taken from the cheatsheet example of bootstrap.
   * You will most likely remove it if using this template.
   */
  function setActiveItem() {
    let hash = window.location.hash;

    if (hash === '') {
      return;
    }

    let link = document.querySelector('.bd-aside a[href="' + hash + '"]');
    let active = document.querySelector('.bd-aside .active');
    // @ts-ignore
    let parent = link.parentNode.parentNode.previousElementSibling;

    link?.classList.add('active');

    if (parent.classList.contains('collapsed')) {
      parent.click();
    }

    if (!active) {
      return;
    }

    // @ts-ignore
    let expanded = active.parentNode.parentNode.previousElementSibling;

    active.classList.remove('active');

    if (expanded && parent !== expanded) {
      expanded.click();
    }
  }

  onMount(() => {
    setActiveItem();
    window.addEventListener('hashchange', setActiveItem);
  });

  onCleanup(() => {
    window.removeEventListener('hashchange', setActiveItem);
  });

  return (
    <>
      <header class="bd-header bg-dark py-3 d-flex align-items-stretch border-bottom border-dark">
        <div class="container-fluid d-flex align-items-center">
          <h1 class="d-flex align-items-center fs-4 text-white mb-0">
            Bootstrap Cheatsheet
          </h1>
        </div>
      </header>
      <aside class="bd-aside sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2">
        <h2 class="h6 pt-4 pb-3 mb-4 border-bottom">On this page</h2>
        <nav class="small" id="toc">
          <ul class="list-unstyled">
            <li class="my-2">
              <button
                class="btn d-inline-flex align-items-center collapsed"
                data-bs-toggle="collapse"
                aria-expanded="false"
                data-bs-target="#contents-collapse"
                aria-controls="contents-collapse"
              >
                Contents
              </button>
              <ul class="list-unstyled ps-3 collapse" id="contents-collapse">
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#typography"
                  >
                    Typography
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#images"
                  >
                    Images
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#tables"
                  >
                    Tables
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#figures"
                  >
                    Figures
                  </a>
                </li>
              </ul>
            </li>
            <li class="my-2">
              <button
                class="btn d-inline-flex align-items-center collapsed"
                data-bs-toggle="collapse"
                aria-expanded="false"
                data-bs-target="#forms-collapse"
                aria-controls="forms-collapse"
              >
                Forms
              </button>
              <ul class="list-unstyled ps-3 collapse" id="forms-collapse">
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#overview"
                  >
                    Overview
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#disabled-forms"
                  >
                    Disabled forms
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#sizing"
                  >
                    Sizing
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#input-group"
                  >
                    Input group
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#floating-labels"
                  >
                    Floating labels
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#validation"
                  >
                    Validation
                  </a>
                </li>
              </ul>
            </li>
            <li class="my-2">
              <button
                class="btn d-inline-flex align-items-center collapsed"
                data-bs-toggle="collapse"
                aria-expanded="false"
                data-bs-target="#components-collapse"
                aria-controls="components-collapse"
              >
                Components
              </button>
              <ul class="list-unstyled ps-3 collapse" id="components-collapse">
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#accordion"
                  >
                    Accordion
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#alerts"
                  >
                    Alerts
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#badge"
                  >
                    Badge
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#breadcrumb"
                  >
                    Breadcrumb
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#buttons"
                  >
                    Buttons
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#button-group"
                  >
                    Button group
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#card"
                  >
                    Card
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#carousel"
                  >
                    Carousel
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#dropdowns"
                  >
                    Dropdowns
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#list-group"
                  >
                    List group
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#modal"
                  >
                    Modal
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#navs"
                  >
                    Navs
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#navbar"
                  >
                    Navbar
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#pagination"
                  >
                    Pagination
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#popovers"
                  >
                    Popovers
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#progress"
                  >
                    Progress
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#scrollspy"
                  >
                    Scrollspy
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#spinners"
                  >
                    Spinners
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#toasts"
                  >
                    Toasts
                  </a>
                </li>
                <li>
                  <a
                    class="d-inline-flex align-items-center rounded"
                    href="#tooltips"
                  >
                    Tooltips
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </aside>
      <div class="bd-cheatsheet container-fluid bg-body">
        <section id="content">
          <h2 class="sticky-xl-top fw-bold pt-3 pt-xl-5 pb-2 pb-xl-3">
            Contents
          </h2>

          <article class="my-3" id="typography">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Typography</h3>
              <a
                class="d-flex align-items-center"
                href="../content/typography/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <p class="display-1">Display 1</p>
                <p class="display-2">Display 2</p>
                <p class="display-3">Display 3</p>
                <p class="display-4">Display 4</p>
                <p class="display-5">Display 5</p>
                <p class="display-6">Display 6</p>
              </div>

              <div class="bd-example">
                <p class="h1">Heading 1</p>
                <p class="h2">Heading 2</p>
                <p class="h3">Heading 3</p>
                <p class="h4">Heading 4</p>
                <p class="h5">Heading 5</p>
                <p class="h6">Heading 6</p>
              </div>

              <div class="bd-example">
                <p class="lead">
                  This is a lead paragraph. It stands out from regular
                  paragraphs.
                </p>
              </div>

              <div class="bd-example">
                <p>
                  You can use the mark tag to <mark>highlight</mark> text.
                </p>
                <p>
                  <del>
                    This line of text is meant to be treated as deleted text.
                  </del>
                </p>
                <p>
                  <s>
                    This line of text is meant to be treated as no longer
                    accurate.
                  </s>
                </p>
                <p>
                  <ins>
                    This line of text is meant to be treated as an addition to
                    the document.
                  </ins>
                </p>
                <p>
                  <u>This line of text will render as underlined.</u>
                </p>
                <p>
                  <small>
                    This line of text is meant to be treated as fine print.
                  </small>
                </p>
                <p>
                  <strong>This line rendered as bold text.</strong>
                </p>
                <p>
                  <em>This line rendered as italicized text.</em>
                </p>
              </div>

              <div class="bd-example">
                <blockquote class="blockquote">
                  <p>A well-known quote, contained in a blockquote element.</p>
                  <footer class="blockquote-footer">
                    Someone famous in{' '}
                    <cite title="Source Title">Source Title</cite>
                  </footer>
                </blockquote>
              </div>

              <div class="bd-example">
                <ul class="list-unstyled">
                  <li>This is a list.</li>
                  <li>It appears completely unstyled.</li>
                  <li>Structurally, it's still a list.</li>
                  <li>
                    However, this style only applies to immediate child
                    elements.
                  </li>
                  <li>
                    Nested lists:
                    <ul>
                      <li>are unaffected by this style</li>
                      <li>will still show a bullet</li>
                      <li>and have appropriate left margin</li>
                    </ul>
                  </li>
                  <li>This may still come in handy in some situations.</li>
                </ul>
              </div>

              <div class="bd-example">
                <ul class="list-inline">
                  <li class="list-inline-item">This is a list item.</li>
                  <li class="list-inline-item">And another one.</li>
                  <li class="list-inline-item">
                    But they're displayed inline.
                  </li>
                </ul>
              </div>
            </div>
          </article>
          <article class="my-3" id="images">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Images</h3>
              <a class="d-flex align-items-center" href="../content/images/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <svg
                  class="bd-placeholder-img bd-placeholder-img-lg img-fluid"
                  width="100%"
                  height="250"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-role="img"
                  aria-label="Placeholder: Responsive image"
                  preserveAspectRatio="xMidYMid slice"
                  tabindex="0"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#868e96" />
                  <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                    Responsive image
                  </text>
                </svg>
              </div>

              <div class="bd-example">
                <svg
                  class="bd-placeholder-img img-thumbnail"
                  width="200"
                  height="200"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-role="img"
                  aria-label="A generic square placeholder image with a white border around it, making it resemble a photograph taken with an old instant camera: 200x200"
                  preserveAspectRatio="xMidYMid slice"
                  tabindex="0"
                >
                  <title>
                    A generic square placeholder image with a white border
                    around it, making it resemble a photograph taken with an old
                    instant camera
                  </title>
                  <rect width="100%" height="100%" fill="#868e96" />
                  <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                    200x200
                  </text>
                </svg>
              </div>
            </div>
          </article>
          <article class="my-3" id="tables">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Tables</h3>
              <a class="d-flex align-items-center" href="../content/tables/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First</th>
                      <th>Last</th>
                      <th>Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td colspan="2">Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bd-example">
                <table class="table table-dark table-borderless">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First</th>
                      <th>Last</th>
                      <th>Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td colspan="2">Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bd-example">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Class</th>
                      <th>Heading</th>
                      <th>Heading</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>Default</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>

                    <tr class="table-primary">
                      <th>Primary</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-secondary">
                      <th>Secondary</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-success">
                      <th>Success</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-danger">
                      <th>Danger</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-warning">
                      <th>Warning</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-info">
                      <th>Info</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-light">
                      <th>Light</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                    <tr class="table-dark">
                      <th>Dark</th>
                      <td>Cell</td>
                      <td>Cell</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="bd-example">
                <table class="table table-sm table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>First</th>
                      <th>Last</th>
                      <th>Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th>2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th>3</th>
                      <td colspan="2">Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </article>
          <article class="my-3" id="figures">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Figures</h3>
              <a class="d-flex align-items-center" href="../content/figures/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <figure class="figure">
                  <svg
                    class="bd-placeholder-img figure-img img-fluid rounded"
                    width="400"
                    height="300"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-role="img"
                    aria-label="Placeholder: 400x300"
                    preserveAspectRatio="xMidYMid slice"
                    tabindex="0"
                  >
                    <title>Placeholder</title>
                    <rect width="100%" height="100%" fill="#868e96" />
                    <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                      400x300
                    </text>
                  </svg>

                  <figcaption class="figure-caption">
                    A caption for the above image.
                  </figcaption>
                </figure>
              </div>
            </div>
          </article>
        </section>

        <section id="forms">
          <h2 class="sticky-xl-top fw-bold pt-3 pt-xl-5 pb-2 pb-xl-3">Forms</h2>

          <article class="my-3" id="overview">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Overview</h3>
              <a class="d-flex align-items-center" href="../forms/overview/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <form>
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                    />
                    <div id="emailHelp" class="form-text">
                      We'll never share your email with anyone else.
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      class="form-control"
                      id="exampleInputPassword1"
                    />
                  </div>
                  <div class="mb-3 form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="exampleCheck1"
                    />
                    <label class="form-check-label" for="exampleCheck1">
                      Check me out
                    </label>
                  </div>
                  <fieldset class="mb-3">
                    <legend>Radios buttons</legend>
                    <div class="form-check">
                      <input
                        type="radio"
                        name="radios"
                        class="form-check-input"
                        id="exampleRadio1"
                      />
                      <label class="form-check-label" for="exampleRadio1">
                        Default radio
                      </label>
                    </div>
                    <div class="mb-3 form-check">
                      <input
                        type="radio"
                        name="radios"
                        class="form-check-input"
                        id="exampleRadio2"
                      />
                      <label class="form-check-label" for="exampleRadio2">
                        Another radio
                      </label>
                    </div>
                  </fieldset>
                  <div class="mb-3">
                    <label class="form-label" for="customFile">
                      Upload
                    </label>
                    <input type="file" class="form-control" id="customFile" />
                  </div>
                  <div class="mb-3 form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckChecked"
                      checked
                    />
                    <label
                      class="form-check-label"
                      for="flexSwitchCheckChecked"
                    >
                      Checked switch checkbox input
                    </label>
                  </div>
                  <div class="mb-3">
                    <label for="customRange3" class="form-label">
                      Example range
                    </label>
                    <input
                      type="range"
                      class="form-range"
                      min="0"
                      max="5"
                      step="0.5"
                      id="customRange3"
                    />
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </article>
          <article class="my-3" id="disabled-forms">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Disabled forms</h3>
              <a
                class="d-flex align-items-center"
                href="../forms/overview/#disabled-forms"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <form>
                  <fieldset disabled aria-label="Disabled fieldset example">
                    <div class="mb-3">
                      <label for="disabledTextInput" class="form-label">
                        Disabled input
                      </label>
                      <input
                        type="text"
                        id="disabledTextInput"
                        class="form-control"
                        placeholder="Disabled input"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="disabledSelect" class="form-label">
                        Disabled select menu
                      </label>
                      <select id="disabledSelect" class="form-select">
                        <option>Disabled select</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="disabledFieldsetCheck"
                          disabled
                        />
                        <label
                          class="form-check-label"
                          for="disabledFieldsetCheck"
                        >
                          Can't check this
                        </label>
                      </div>
                    </div>
                    <fieldset class="mb-3">
                      <legend>Disabled radios buttons</legend>
                      <div class="form-check">
                        <input
                          type="radio"
                          name="radios"
                          class="form-check-input"
                          id="disabledRadio1"
                          disabled
                        />
                        <label class="form-check-label" for="disabledRadio1">
                          Disabled radio
                        </label>
                      </div>
                      <div class="mb-3 form-check">
                        <input
                          type="radio"
                          name="radios"
                          class="form-check-input"
                          id="disabledRadio2"
                          disabled
                        />
                        <label class="form-check-label" for="disabledRadio2">
                          Another radio
                        </label>
                      </div>
                    </fieldset>
                    <div class="mb-3">
                      <label class="form-label" for="disabledCustomFile">
                        Upload
                      </label>
                      <input
                        type="file"
                        class="form-control"
                        id="disabledCustomFile"
                        disabled
                      />
                    </div>
                    <div class="mb-3 form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="disabledSwitchCheckChecked"
                        checked
                        disabled
                      />
                      <label
                        class="form-check-label"
                        for="disabledSwitchCheckChecked"
                      >
                        Disabled checked switch checkbox input
                      </label>
                    </div>
                    <div class="mb-3">
                      <label for="disabledRange" class="form-label">
                        Disabled range
                      </label>
                      <input
                        type="range"
                        class="form-range"
                        min="0"
                        max="5"
                        step="0.5"
                        id="disabledRange"
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">
                      Submit
                    </button>
                  </fieldset>
                </form>
              </div>
            </div>
          </article>
          <article class="my-3" id="sizing">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Sizing</h3>
              <a
                class="d-flex align-items-center"
                href="../forms/form-control/#sizing"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="mb-3">
                  <input
                    class="form-control form-control-lg"
                    type="text"
                    placeholder=".form-control-lg"
                    aria-label=".form-control-lg example"
                  />
                </div>
                <div class="mb-3">
                  <select
                    class="form-select form-select-lg mb-3"
                    aria-label=".form-select-lg example"
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div class="mb-3">
                  <input
                    type="file"
                    class="form-control form-control-lg"
                    aria-label="Large file input example"
                  />
                </div>
              </div>

              <div class="bd-example">
                <div class="mb-3">
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    placeholder=".form-control-sm"
                    aria-label=".form-control-sm example"
                  />
                </div>
                <div class="mb-3">
                  <select
                    class="form-select form-select-sm"
                    aria-label=".form-select-sm example"
                  >
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                </div>
                <div class="mb-3">
                  <input
                    type="file"
                    class="form-control form-control-sm"
                    aria-label="Small file input example"
                  />
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="input-group">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Input group</h3>
              <a class="d-flex align-items-center" href="../forms/input-group/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon1">
                    @
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                  />
                </div>
                <div class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <span class="input-group-text" id="basic-addon2">
                    @example.com
                  </span>
                </div>
                <label for="basic-url" class="form-label">
                  Your vanity URL
                </label>
                <div class="input-group mb-3">
                  <span class="input-group-text" id="basic-addon3">
                    https://example.com/users/
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    id="basic-url"
                    aria-describedby="basic-addon3"
                  />
                </div>
                <div class="input-group mb-3">
                  <span class="input-group-text">$</span>
                  <input
                    type="text"
                    class="form-control"
                    aria-label="Amount (to the nearest dollar)"
                  />
                  <span class="input-group-text">.00</span>
                </div>
                <div class="input-group">
                  <span class="input-group-text">With textarea</span>
                  <textarea
                    class="form-control"
                    aria-label="With textarea"
                  ></textarea>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="floating-labels">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Floating labels</h3>
              <a
                class="d-flex align-items-center"
                href="../forms/floating-labels/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <form>
                  <div class="form-floating mb-3">
                    <input
                      type="email"
                      class="form-control"
                      id="floatingInput"
                      placeholder="name@example.com"
                    />
                    <label for="floatingInput">Email address</label>
                  </div>
                  <div class="form-floating">
                    <input
                      type="password"
                      class="form-control"
                      id="floatingPassword"
                      placeholder="Password"
                    />
                    <label for="floatingPassword">Password</label>
                  </div>
                </form>
              </div>
            </div>
          </article>
          <article class="my-3" id="validation">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Validation</h3>
              <a class="d-flex align-items-center" href="../forms/validation/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <form class="row g-3">
                  <div class="col-md-4">
                    <label for="validationServer01" class="form-label">
                      First name
                    </label>
                    <input
                      type="text"
                      class="form-control is-valid"
                      id="validationServer01"
                      value="Mark"
                      required
                    />
                    <div class="valid-feedback">Looks good!</div>
                  </div>
                  <div class="col-md-4">
                    <label for="validationServer02" class="form-label">
                      Last name
                    </label>
                    <input
                      type="text"
                      class="form-control is-valid"
                      id="validationServer02"
                      value="Otto"
                      required
                    />
                    <div class="valid-feedback">Looks good!</div>
                  </div>
                  <div class="col-md-4">
                    <label for="validationServerUsername" class="form-label">
                      Username
                    </label>
                    <div class="input-group has-validation">
                      <span class="input-group-text" id="inputGroupPrepend3">
                        @
                      </span>
                      <input
                        type="text"
                        class="form-control is-invalid"
                        id="validationServerUsername"
                        aria-describedby="inputGroupPrepend3"
                        required
                      />
                      <div class="invalid-feedback">
                        Please choose a username.
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label for="validationServer03" class="form-label">
                      City
                    </label>
                    <input
                      type="text"
                      class="form-control is-invalid"
                      id="validationServer03"
                      required
                    />
                    <div class="invalid-feedback">
                      Please provide a valid city.
                    </div>
                  </div>
                  <div class="col-md-3">
                    <label for="validationServer04" class="form-label">
                      State
                    </label>
                    <select
                      class="form-select is-invalid"
                      id="validationServer04"
                      required
                    >
                      <option selected disabled value="">
                        Choose...
                      </option>
                      <option>...</option>
                    </select>
                    <div class="invalid-feedback">
                      Please select a valid state.
                    </div>
                  </div>
                  <div class="col-md-3">
                    <label for="validationServer05" class="form-label">
                      Zip
                    </label>
                    <input
                      type="text"
                      class="form-control is-invalid"
                      id="validationServer05"
                      required
                    />
                    <div class="invalid-feedback">
                      Please provide a valid zip.
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-check">
                      <input
                        class="form-check-input is-invalid"
                        type="checkbox"
                        value=""
                        id="invalidCheck3"
                        required
                      />
                      <label class="form-check-label" for="invalidCheck3">
                        Agree to terms and conditions
                      </label>
                      <div class="invalid-feedback">
                        You must agree before submitting.
                      </div>
                    </div>
                  </div>
                  <div class="col-12">
                    <button class="btn btn-primary" type="submit">
                      Submit form
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </article>
        </section>

        <section id="components">
          <h2 class="sticky-xl-top fw-bold pt-3 pt-xl-5 pb-2 pb-xl-3">
            Components
          </h2>

          <article class="my-3" id="accordion">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Accordion</h3>
              <a
                class="d-flex align-items-center"
                href="../components/accordion/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="accordion" id="accordionExample">
                  <div class="accordion-item">
                    <h4 class="accordion-header" id="headingOne">
                      <button
                        class="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        Accordion Item #1
                      </button>
                    </h4>
                    <div
                      id="collapseOne"
                      class="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <strong>
                          This is the first item's accordion body.
                        </strong>{' '}
                        It is hidden by default, until the collapse plugin adds
                        the appropriate classes that we use to style each
                        element. These classes control the overall appearance,
                        as well as the showing and hiding via CSS transitions.
                        You can modify any of this with custom CSS or overriding
                        our default variables. It's also worth noting that just
                        about any HTML can go within the{' '}
                        <code>.accordion-body</code>, though the transition does
                        limit overflow.
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h4 class="accordion-header" id="headingTwo">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        Accordion Item #2
                      </button>
                    </h4>
                    <div
                      id="collapseTwo"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingTwo"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <strong>
                          This is the second item's accordion body.
                        </strong>{' '}
                        It is hidden by default, until the collapse plugin adds
                        the appropriate classes that we use to style each
                        element. These classes control the overall appearance,
                        as well as the showing and hiding via CSS transitions.
                        You can modify any of this with custom CSS or overriding
                        our default variables. It's also worth noting that just
                        about any HTML can go within the{' '}
                        <code>.accordion-body</code>, though the transition does
                        limit overflow.
                      </div>
                    </div>
                  </div>
                  <div class="accordion-item">
                    <h4 class="accordion-header" id="headingThree">
                      <button
                        class="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        Accordion Item #3
                      </button>
                    </h4>
                    <div
                      id="collapseThree"
                      class="accordion-collapse collapse"
                      aria-labelledby="headingThree"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        <strong>
                          This is the third item's accordion body.
                        </strong>{' '}
                        It is hidden by default, until the collapse plugin adds
                        the appropriate classes that we use to style each
                        element. These classes control the overall appearance,
                        as well as the showing and hiding via CSS transitions.
                        You can modify any of this with custom CSS or overriding
                        our default variables. It's also worth noting that just
                        about any HTML can go within the{' '}
                        <code>.accordion-body</code>, though the transition does
                        limit overflow.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="alerts">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Alerts</h3>
              <a class="d-flex align-items-center" href="../components/alerts/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div
                  class="alert alert-primary alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple primary alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-secondary alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple secondary alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-success alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple success alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-danger alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple danger alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-warning alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple warning alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-info alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple info alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-light alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple light alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
                <div
                  class="alert alert-dark alert-dismissible fade show"
                  aria-role="alert"
                >
                  A simple dark alert with{' '}
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="alert-link"
                  >
                    an example link
                  </a>
                  . Give it a click if you like.
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </div>
              </div>

              <div class="bd-example">
                <div class="alert alert-success" aria-role="alert">
                  <h4 class="alert-heading">Well done!</h4>
                  <p>
                    Aww yeah, you successfully read this important alert
                    message. This example text is going to run a bit longer so
                    that you can see how spacing within an alert works with this
                    kind of content.
                  </p>
                  <hr />
                  <p class="mb-0">
                    Whenever you need to, be sure to use margin utilities to
                    keep things nice and tidy.
                  </p>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="badge">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Badge</h3>
              <a class="d-flex align-items-center" href="../components/badge/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <p class="h1">
                  Example heading <span class="badge bg-primary">New</span>
                </p>
                <p class="h2">
                  Example heading <span class="badge bg-secondary">New</span>
                </p>
                <p class="h3">
                  Example heading <span class="badge bg-success">New</span>
                </p>
                <p class="h4">
                  Example heading <span class="badge bg-danger">New</span>
                </p>
                <p class="h5">
                  Example heading{' '}
                  <span class="badge bg-warning text-dark">New</span>
                </p>
                <p class="h6">
                  Example heading{' '}
                  <span class="badge bg-info text-dark">New</span>
                </p>
                <p class="h6">
                  Example heading{' '}
                  <span class="badge bg-light text-dark">New</span>
                </p>
                <p class="h6">
                  Example heading <span class="badge bg-dark">New</span>
                </p>
              </div>

              <div class="bd-example">
                <span class="badge rounded-pill bg-primary">Primary</span>
                <span class="badge rounded-pill bg-secondary">Secondary</span>
                <span class="badge rounded-pill bg-success">Success</span>
                <span class="badge rounded-pill bg-danger">Danger</span>
                <span class="badge rounded-pill bg-warning text-dark">
                  Warning
                </span>
                <span class="badge rounded-pill bg-info text-dark">Info</span>
                <span class="badge rounded-pill bg-light text-dark">Light</span>
                <span class="badge rounded-pill bg-dark">Dark</span>
              </div>
            </div>
          </article>
          <article class="my-3" id="breadcrumb">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Breadcrumb</h3>
              <a
                class="d-flex align-items-center"
                href="../components/breadcrumb/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Home
                      </a>
                    </li>
                    <li class="breadcrumb-item">
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        Library
                      </a>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                      Data
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </article>
          <article class="my-3" id="buttons">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Buttons</h3>
              <a
                class="d-flex align-items-center"
                href="../components/buttons/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <button type="button" class="btn btn-primary">
                  Primary
                </button>
                <button type="button" class="btn btn-secondary">
                  Secondary
                </button>
                <button type="button" class="btn btn-success">
                  Success
                </button>
                <button type="button" class="btn btn-danger">
                  Danger
                </button>
                <button type="button" class="btn btn-warning">
                  Warning
                </button>
                <button type="button" class="btn btn-info">
                  Info
                </button>
                <button type="button" class="btn btn-light">
                  Light
                </button>
                <button type="button" class="btn btn-dark">
                  Dark
                </button>

                <button type="button" class="btn btn-link">
                  Link
                </button>
              </div>

              <div class="bd-example">
                <button type="button" class="btn btn-outline-primary">
                  Primary
                </button>
                <button type="button" class="btn btn-outline-secondary">
                  Secondary
                </button>
                <button type="button" class="btn btn-outline-success">
                  Success
                </button>
                <button type="button" class="btn btn-outline-danger">
                  Danger
                </button>
                <button type="button" class="btn btn-outline-warning">
                  Warning
                </button>
                <button type="button" class="btn btn-outline-info">
                  Info
                </button>
                <button type="button" class="btn btn-outline-light">
                  Light
                </button>
                <button type="button" class="btn btn-outline-dark">
                  Dark
                </button>
              </div>

              <div class="bd-example">
                <button type="button" class="btn btn-primary btn-sm">
                  Small button
                </button>
                <button type="button" class="btn btn-primary">
                  Standard button
                </button>
                <button type="button" class="btn btn-primary btn-lg">
                  Large button
                </button>
              </div>
            </div>
          </article>
          <article class="my-3" id="button-group">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Button group</h3>
              <a
                class="d-flex align-items-center"
                href="../components/button-group/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div
                  class="btn-toolbar"
                  aria-role="toolbar"
                  aria-label="Toolbar with button groups"
                >
                  <div
                    class="btn-group me-2"
                    aria-role="group"
                    aria-label="First group"
                  >
                    <button type="button" class="btn btn-secondary">
                      1
                    </button>
                    <button type="button" class="btn btn-secondary">
                      2
                    </button>
                    <button type="button" class="btn btn-secondary">
                      3
                    </button>
                    <button type="button" class="btn btn-secondary">
                      4
                    </button>
                  </div>
                  <div
                    class="btn-group me-2"
                    aria-role="group"
                    aria-label="Second group"
                  >
                    <button type="button" class="btn btn-secondary">
                      5
                    </button>
                    <button type="button" class="btn btn-secondary">
                      6
                    </button>
                    <button type="button" class="btn btn-secondary">
                      7
                    </button>
                  </div>
                  <div
                    class="btn-group"
                    aria-role="group"
                    aria-label="Third group"
                  >
                    <button type="button" class="btn btn-secondary">
                      8
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="card">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Card</h3>
              <a class="d-flex align-items-center" href="../components/card/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="row  row-cols-1 row-cols-md-2 g-4">
                  <div class="col">
                    <div class="card">
                      <svg
                        class="bd-placeholder-img card-img-top"
                        width="100%"
                        height="180"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-role="img"
                        aria-label="Placeholder: Image cap"
                        preserveAspectRatio="xMidYMid slice"
                        tabindex="0"
                      >
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#868e96" />
                        <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                          Image cap
                        </text>
                      </svg>

                      <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          class="btn btn-primary"
                        >
                          Go somewhere
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="card">
                      <div class="card-header">Featured</div>
                      <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          class="btn btn-primary"
                        >
                          Go somewhere
                        </a>
                      </div>
                      <div class="card-footer text-muted">2 days ago</div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title">Card title</h5>
                        <p class="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                      </div>
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item">An item</li>
                        <li class="list-group-item">A second item</li>
                        <li class="list-group-item">A third item</li>
                      </ul>
                      <div class="card-body">
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          class="card-link"
                        >
                          Card link
                        </a>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          class="card-link"
                        >
                          Another link
                        </a>
                      </div>
                    </div>
                  </div>
                  <div class="col">
                    <div class="card">
                      <div class="row g-0">
                        <div class="col-md-4">
                          <svg
                            class="bd-placeholder-img"
                            width="100%"
                            height="250"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-role="img"
                            aria-label="Placeholder: Image"
                            preserveAspectRatio="xMidYMid slice"
                            tabindex="0"
                          >
                            <title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#868e96" />
                            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">
                              Image
                            </text>
                          </svg>
                        </div>
                        <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <p class="card-text">
                              This is a wider card with supporting text below as
                              a natural lead-in to additional content. This
                              content is a little bit longer.
                            </p>
                            <p class="card-text">
                              <small class="text-muted">
                                Last updated 3 mins ago
                              </small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="carousel">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Carousel</h3>
              <a
                class="d-flex align-items-center"
                href="../components/carousel/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div
                  id="carouselExampleCaptions"
                  class="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div class="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="0"
                      class="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    ></button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleCaptions"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    ></button>
                  </div>
                  <div class="carousel-inner">
                    <div class="carousel-item active">
                      <svg
                        class="bd-placeholder-img bd-placeholder-img-lg d-block w-100"
                        width="800"
                        height="400"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-role="img"
                        aria-label="Placeholder: First slide"
                        preserveAspectRatio="xMidYMid slice"
                        tabindex="0"
                      >
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#777" />
                        <text x="50%" y="50%" fill="#555" dy=".3em">
                          First slide
                        </text>
                      </svg>

                      <div class="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>
                          Some representative placeholder content for the first
                          slide.
                        </p>
                      </div>
                    </div>
                    <div class="carousel-item">
                      <svg
                        class="bd-placeholder-img bd-placeholder-img-lg d-block w-100"
                        width="800"
                        height="400"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-role="img"
                        aria-label="Placeholder: Second slide"
                        preserveAspectRatio="xMidYMid slice"
                        tabindex="0"
                      >
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#666" />
                        <text x="50%" y="50%" fill="#444" dy=".3em">
                          Second slide
                        </text>
                      </svg>

                      <div class="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p>
                          Some representative placeholder content for the second
                          slide.
                        </p>
                      </div>
                    </div>
                    <div class="carousel-item">
                      <svg
                        class="bd-placeholder-img bd-placeholder-img-lg d-block w-100"
                        width="800"
                        height="400"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-role="img"
                        aria-label="Placeholder: Third slide"
                        preserveAspectRatio="xMidYMid slice"
                        tabindex="0"
                      >
                        <title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#555" />
                        <text x="50%" y="50%" fill="#333" dy=".3em">
                          Third slide
                        </text>
                      </svg>

                      <div class="carousel-caption d-none d-md-block">
                        <h5>Third slide label</h5>
                        <p>
                          Some representative placeholder content for the third
                          slide.
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    class="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="prev"
                  >
                    <span
                      class="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Previous</span>
                  </button>
                  <button
                    class="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselExampleCaptions"
                    data-bs-slide="next"
                  >
                    <span
                      class="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span class="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="dropdowns">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Dropdowns</h3>
              <a
                class="d-flex align-items-center"
                href="../components/dropdowns/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="btn-group w-100 align-items-center justify-content-between flex-wrap">
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary btn-sm dropdown-toggle"
                      type="button"
                      id="dropdownMenuButtonSM"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropdown button
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButtonSM"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropdown button
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary btn-lg dropdown-toggle"
                      type="button"
                      id="dropdownMenuButtonLG"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropdown button
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButtonLG"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bd-example">
                <div class="btn-group">
                  <button type="button" class="btn btn-primary">
                    Primary
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span class="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="btn-group">
                  <button type="button" class="btn btn-secondary">
                    Secondary
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span class="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="btn-group">
                  <button type="button" class="btn btn-success">
                    Success
                  </button>
                  <button
                    type="button"
                    class="btn btn-success dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span class="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="btn-group">
                  <button type="button" class="btn btn-info">
                    Info
                  </button>
                  <button
                    type="button"
                    class="btn btn-info dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span class="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="btn-group">
                  <button type="button" class="btn btn-warning">
                    Warning
                  </button>
                  <button
                    type="button"
                    class="btn btn-warning dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span class="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="btn-group">
                  <button type="button" class="btn btn-danger">
                    Danger
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger dropdown-toggle dropdown-toggle-split"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span class="visually-hidden">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu">
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Another action
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Something else here
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="bd-example">
                <div class="btn-group w-100 align-items-center justify-content-between flex-wrap">
                  <div class="dropend">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropendMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropend button
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropendMenuButton"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="dropup">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropupMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropup button
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropupMenuButton"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="dropstart">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropstartMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Dropstart button
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropstartMenuButton"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Something else here
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bd-example">
                <div class="btn-group">
                  <div class="dropdown">
                    <button
                      class="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownRightMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      End-aligned menu
                    </button>
                    <ul
                      class="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownRightMenuButton"
                    >
                      <li>
                        <h6 class="dropdown-header">Dropdown header</h6>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Action
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Another action
                        </a>
                      </li>
                      <li>
                        <hr class="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Separated link
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="list-group">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>List group</h3>
              <a
                class="d-flex align-items-center"
                href="../components/list-group/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <ul class="list-group">
                  <li class="list-group-item disabled" aria-disabled="true">
                    A disabled item
                  </li>
                  <li class="list-group-item">A second item</li>
                  <li class="list-group-item">A third item</li>
                  <li class="list-group-item">A fourth item</li>
                  <li class="list-group-item">And a fifth one</li>
                </ul>
              </div>

              <div class="bd-example">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">An item</li>
                  <li class="list-group-item">A second item</li>
                  <li class="list-group-item">A third item</li>
                  <li class="list-group-item">A fourth item</li>
                  <li class="list-group-item">And a fifth one</li>
                </ul>
              </div>

              <div class="bd-example">
                <div class="list-group">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action"
                  >
                    A simple default list group item
                  </a>

                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-primary"
                  >
                    A simple primary list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-secondary"
                  >
                    A simple secondary list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-success"
                  >
                    A simple success list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-danger"
                  >
                    A simple danger list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-warning"
                  >
                    A simple warning list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-info"
                  >
                    A simple info list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-light"
                  >
                    A simple light list group item
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    class="list-group-item list-group-item-action list-group-item-dark"
                  >
                    A simple dark list group item
                  </a>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="modal">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Modal</h3>
              <a class="d-flex align-items-center" href="../components/modal/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="d-flex justify-content-between flex-wrap">
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalDefault"
                  >
                    Launch demo modal
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdropLive"
                  >
                    Launch static backdrop modal
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalCenteredScrollable"
                  >
                    Vertically centered scrollable modal
                  </button>
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalFullscreen"
                  >
                    Full screen
                  </button>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="navs">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Navs</h3>
              <a
                class="d-flex align-items-center"
                href="../components/navs-tabs/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <nav class="nav">
                  <a
                    class="nav-link active"
                    aria-current="page"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Active
                  </a>
                  <a
                    class="nav-link"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Link
                  </a>
                  <a
                    class="nav-link"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Link
                  </a>
                  <a
                    class="nav-link disabled"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    tabindex="-1"
                    aria-disabled="true"
                  >
                    Disabled
                  </a>
                </nav>
              </div>

              <div class="bd-example">
                <nav>
                  <div
                    class="nav nav-tabs mb-3"
                    id="nav-tab"
                    aria-role="tablist"
                  >
                    <button
                      class="nav-link active"
                      id="nav-home-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-home"
                      type="button"
                      aria-role="tab"
                      aria-controls="nav-home"
                      aria-selected="true"
                    >
                      Home
                    </button>
                    <button
                      class="nav-link"
                      id="nav-profile-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-profile"
                      type="button"
                      aria-role="tab"
                      aria-controls="nav-profile"
                      aria-selected="false"
                    >
                      Profile
                    </button>
                    <button
                      class="nav-link"
                      id="nav-contact-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#nav-contact"
                      type="button"
                      aria-role="tab"
                      aria-controls="nav-contact"
                      aria-selected="false"
                    >
                      Contact
                    </button>
                  </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                  <div
                    class="tab-pane fade show active"
                    id="nav-home"
                    aria-role="tabpanel"
                    aria-labelledby="nav-home-tab"
                  >
                    <p>
                      Placeholder content for the tab panel. This one relates to
                      the home tab. Takes you miles high, so high, 'cause she’s
                      got that one international smile. There's a stranger in my
                      bed, there's a pounding in my head. Oh, no. In another
                      life I would make you stay. ‘Cause I, I’m capable of
                      anything. Suiting up for my crowning battle. Used to steal
                      your parents' liquor and climb to the roof. Tone, tan fit
                      and ready, turn it up cause its gettin' heavy. Her love is
                      like a drug. I guess that I forgot I had a choice.
                    </p>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="nav-profile"
                    aria-role="tabpanel"
                    aria-labelledby="nav-profile-tab"
                  >
                    <p>
                      Placeholder content for the tab panel. This one relates to
                      the profile tab. You got the finest architecture. Passport
                      stamps, she's cosmopolitan. Fine, fresh, fierce, we got it
                      on lock. Never planned that one day I'd be losing you. She
                      eats your heart out. Your kiss is cosmic, every move is
                      magic. I mean the ones, I mean like she's the one.
                      Greetings loved ones let's take a journey. Just own the
                      night like the 4th of July! But you'd rather get wasted.
                    </p>
                  </div>
                  <div
                    class="tab-pane fade"
                    id="nav-contact"
                    aria-role="tabpanel"
                    aria-labelledby="nav-contact-tab"
                  >
                    <p>
                      Placeholder content for the tab panel. This one relates to
                      the contact tab. Her love is like a drug. All my girls
                      vintage Chanel baby. Got a motel and built a fort out of
                      sheets. 'Cause she's the muse and the artist. (This is how
                      we do) So you wanna play with magic. So just be sure
                      before you give it all to me. I'm walking, I'm walking on
                      air (tonight). Skip the talk, heard it all, time to walk
                      the walk. Catch her if you can. Stinging like a bee I
                      earned my stripes.
                    </p>
                  </div>
                </div>
              </div>

              <div class="bd-example">
                <ul class="nav nav-pills">
                  <li class="nav-item">
                    <a
                      class="nav-link active"
                      aria-current="page"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      Active
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      Link
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      Link
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link disabled"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      tabindex="-1"
                      aria-disabled="true"
                    >
                      Disabled
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </article>
          <article class="my-3" id="navbar">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Navbar</h3>
              <a class="d-flex align-items-center" href="../components/navbar/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                  <div class="container-fluid">
                    <a
                      class="navbar-brand"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        src="../assets/brand/bootstrap-logo-white.svg"
                        width="38"
                        height="30"
                        class="d-inline-block align-top"
                        alt="Bootstrap"
                        loading="lazy"
                        style="filter: invert(1) grayscale(100%) brightness(200%);"
                      />
                    </a>
                    <button
                      class="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span class="navbar-toggler-icon"></span>
                    </button>
                    <div
                      class="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                          <a
                            class="nav-link active"
                            aria-current="page"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Home
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Link
                          </a>
                        </li>
                        <li class="nav-item dropdown">
                          <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            id="navbarDropdown"
                            aria-role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Dropdown
                          </a>
                          <ul
                            class="dropdown-menu"
                            aria-labelledby="navbarDropdown"
                          >
                            <li>
                              <a
                                class="dropdown-item"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                              >
                                Action
                              </a>
                            </li>
                            <li>
                              <a
                                class="dropdown-item"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                              >
                                Another action
                              </a>
                            </li>
                            <li>
                              <hr class="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                class="dropdown-item"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                              >
                                Something else here
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link disabled"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            tabindex="-1"
                            aria-disabled="true"
                          >
                            Disabled
                          </a>
                        </li>
                      </ul>
                      <form class="d-flex">
                        <input
                          class="form-control me-2"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button class="btn btn-outline-dark" type="submit">
                          Search
                        </button>
                      </form>
                    </div>
                  </div>
                </nav>

                <nav class="navbar navbar-expand-lg navbar-dark bg-primary mt-5">
                  <div class="container-fluid">
                    <a
                      class="navbar-brand"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <img
                        src="../assets/brand/bootstrap-logo-white.svg"
                        width="38"
                        height="30"
                        class="d-inline-block align-top"
                        alt="Bootstrap"
                        loading="lazy"
                      />
                    </a>
                    <button
                      class="navbar-toggler"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#navbarSupportedContent2"
                      aria-controls="navbarSupportedContent2"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span class="navbar-toggler-icon"></span>
                    </button>
                    <div
                      class="collapse navbar-collapse"
                      id="navbarSupportedContent2"
                    >
                      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                          <a
                            class="nav-link active"
                            aria-current="page"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Home
                          </a>
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                          >
                            Link
                          </a>
                        </li>
                        <li class="nav-item dropdown">
                          <a
                            class="nav-link dropdown-toggle"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            id="navbarDropdown2"
                            aria-role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Dropdown
                          </a>
                          <ul
                            class="dropdown-menu"
                            aria-labelledby="navbarDropdown2"
                          >
                            <li>
                              <a
                                class="dropdown-item"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                              >
                                Action
                              </a>
                            </li>
                            <li>
                              <a
                                class="dropdown-item"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                              >
                                Another action
                              </a>
                            </li>
                            <li>
                              <hr class="dropdown-divider" />
                            </li>
                            <li>
                              <a
                                class="dropdown-item"
                                href="#"
                                onClick={(e) => e.preventDefault()}
                              >
                                Something else here
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li class="nav-item">
                          <a
                            class="nav-link disabled"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            tabindex="-1"
                            aria-disabled="true"
                          >
                            Disabled
                          </a>
                        </li>
                      </ul>
                      <form class="d-flex">
                        <input
                          class="form-control me-2"
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                        />
                        <button class="btn btn-outline-light" type="submit">
                          Search
                        </button>
                      </form>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </article>
          <article class="my-3" id="pagination">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Pagination</h3>
              <a
                class="d-flex align-items-center"
                href="../components/pagination/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <nav aria-label="Pagination example">
                  <ul class="pagination pagination-sm">
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </a>
                    </li>
                    <li class="page-item active" aria-current="page">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        2
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div class="bd-example">
                <nav aria-label="Standard pagination example">
                  <ul class="pagination">
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        2
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-label="Next"
                      >
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div class="bd-example">
                <nav aria-label="Another pagination example">
                  <ul class="pagination pagination-lg flex-wrap">
                    <li class="page-item disabled">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        tabindex="-1"
                        aria-disabled="true"
                      >
                        Previous
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </a>
                    </li>
                    <li class="page-item active" aria-current="page">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        2
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </a>
                    </li>
                    <li class="page-item">
                      <a
                        class="page-link"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                      >
                        Next
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </article>
          <article class="my-3" id="popovers">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Popovers</h3>
              <a
                class="d-flex align-items-center"
                href="../components/popovers/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <button
                  type="button"
                  class="btn btn-lg btn-danger"
                  data-bs-toggle="popover"
                  ref={(popover) => new bootstrap.Popover(popover)}
                  title="Popover title"
                  data-bs-content="And here's some amazing content. It's very engaging. Right?"
                >
                  Click to toggle popover
                </button>
              </div>

              <div class="bd-example">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-container="body"
                  data-bs-toggle="popover"
                  ref={(popover) => new bootstrap.Popover(popover)}
                  data-bs-placement="top"
                  data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                >
                  Popover on top
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-container="body"
                  data-bs-toggle="popover"
                  ref={(popover) => new bootstrap.Popover(popover)}
                  data-bs-placement="right"
                  data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                >
                  Popover on end
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-container="body"
                  data-bs-toggle="popover"
                  ref={(popover) => new bootstrap.Popover(popover)}
                  data-bs-placement="bottom"
                  data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                >
                  Popover on bottom
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-container="body"
                  data-bs-toggle="popover"
                  ref={(popover) => new bootstrap.Popover(popover)}
                  data-bs-placement="left"
                  data-bs-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus."
                >
                  Popover on start
                </button>
              </div>
            </div>
          </article>
          <article class="my-3" id="progress">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Progress</h3>
              <a
                class="d-flex align-items-center"
                href="../components/progress/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="progress mb-3">
                  <div class="progress-bar" aria-role="progressbar">
                    0%
                  </div>
                </div>
                <div class="progress mb-3">
                  <div
                    class="progress-bar bg-success w-25"
                    aria-role="progressbar"
                  >
                    25%
                  </div>
                </div>
                <div class="progress mb-3">
                  <div
                    class="progress-bar bg-info text-dark w-50"
                    aria-role="progressbar"
                  >
                    50%
                  </div>
                </div>
                <div class="progress mb-3">
                  <div
                    class="progress-bar bg-warning text-dark w-75"
                    aria-role="progressbar"
                  >
                    75%
                  </div>
                </div>
                <div class="progress">
                  <div
                    class="progress-bar bg-danger w-100"
                    aria-role="progressbar"
                  >
                    100%
                  </div>
                </div>
              </div>

              <div class="bd-example">
                <div class="progress">
                  <div
                    class="progress-bar"
                    aria-role="progressbar"
                    style="width: 15%"
                  ></div>
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated bg-success"
                    aria-role="progressbar"
                    style="width: 40%"
                  ></div>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="scrollspy">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Scrollspy</h3>
              <a
                class="d-flex align-items-center"
                href="../components/scrollspy/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <nav
                  id="navbar-example2"
                  class="navbar navbar-light bg-light px-3"
                >
                  <a
                    class="navbar-brand"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    Navbar
                  </a>
                  <ul class="nav nav-pills">
                    <li class="nav-item">
                      <a class="nav-link" href="#fat">
                        @fat
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" href="#mdo">
                        @mdo
                      </a>
                    </li>
                    <li class="nav-item dropdown">
                      <a
                        class="nav-link dropdown-toggle"
                        data-bs-toggle="dropdown"
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        aria-role="button"
                        aria-expanded="false"
                      >
                        Dropdown
                      </a>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#one">
                            one
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#two">
                            two
                          </a>
                        </li>
                        <li>
                          <hr class="dropdown-divider" />
                        </li>
                        <li>
                          <a class="dropdown-item" href="#three">
                            three
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
                <div
                  data-bs-spy="scroll"
                  data-bs-target="#navbar-example2"
                  data-bs-offset="0"
                  class="scrollspy-example"
                  tabindex="0"
                >
                  <h4 id="fat">@fat</h4>
                  <p>
                    Placeholder content for the scrollspy example. You got the
                    finest architecture. Passport stamps, she's cosmopolitan.
                    Fine, fresh, fierce, we got it on lock. Never planned that
                    one day I'd be losing you. She eats your heart out. Your
                    kiss is cosmic, every move is magic. I mean the ones, I mean
                    like she's the one. Greetings loved ones let's take a
                    journey. Just own the night like the 4th of July! But you'd
                    rather get wasted.
                  </p>
                  <h4 id="mdo">@mdo</h4>
                  <p>
                    Placeholder content for the scrollspy example. 'Cause she's
                    the muse and the artist. (This is how we do) So you wanna
                    play with magic. So just be sure before you give it all to
                    me. I'm walking, I'm walking on air (tonight). Skip the
                    talk, heard it all, time to walk the walk.
                  </p>
                  <h4 id="one">one</h4>
                  <p>
                    Placeholder content for the scrollspy example. Takes you
                    miles high, so high, 'cause she’s got that one international
                    smile. There's a stranger in my bed, there's a pounding in
                    my head. Oh, no. In another life I would make you stay.
                    ‘Cause I, I’m capable of anything. Suiting up for my
                    crowning battle. Used to steal your parents' liquor and
                    climb to the roof. Tone, tan fit and ready, turn it up cause
                    its gettin' heavy. Her love is like a drug. I guess that I
                    forgot I had a choice.
                  </p>
                  <h4 id="two">two</h4>
                  <p>
                    Placeholder content for the scrollspy example. It's time to
                    bring out the big balloons. I'm walking, I'm walking on air
                    (tonight). Yeah, we maxed our credit cards and got kicked
                    out of the bar. Yo, shout out to all you kids, buying bottle
                    service, with your rent money. I'm ma get your heart racing
                    in my skin-tight jeans. If you get the chance you better
                    keep her. Yo, shout out to all you kids, buying bottle
                    service, with your rent money.
                  </p>
                  <h4 id="three">three</h4>
                  <p>
                    Placeholder content for the scrollspy example. If you wanna
                    dance, if you want it all, you know that I'm the girl that
                    you should call. Walk through the storm I would. So let me
                    get you in your birthday suit. The one that got away. Last
                    Friday night, yeah I think we broke the law, always say
                    we're gonna stop. 'Cause she's a little bit of Yoko, And
                    she's a little bit of 'Oh no'. I want the jaw droppin', eye
                    poppin', head turnin', body shockin'. Yeah, we maxed our
                    credit cards and got kicked out of the bar.
                  </p>
                  <p>And some more placeholder content, for good measure.</p>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="spinners">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Spinners</h3>
              <a
                class="d-flex align-items-center"
                href="../components/spinners/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example">
                <div class="spinner-border text-primary" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-secondary" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-success" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-danger" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-warning" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-info" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-light" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-border text-dark" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>

              <div class="bd-example">
                <div class="spinner-grow text-primary" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-secondary" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-success" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-danger" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-warning" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-info" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-light" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-dark" aria-role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </article>
          <article class="my-3" id="toasts">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Toasts</h3>
              <a class="d-flex align-items-center" href="../components/toasts/">
                Documentation
              </a>
            </div>

            <div>
              <div class="bd-example bg-dark p-5 align-items-center">
                <div
                  class="toast"
                  ref={(toastNode) => {
                    const toast = new bootstrap.Toast(toastNode, {
                      autohide: false,
                    });

                    toast.show();
                  }}
                  aria-role="alert"
                  aria-live="assertive"
                  aria-atomic="true"
                >
                  <div class="toast-header">
                    <svg
                      class="bd-placeholder-img rounded me-2"
                      width="20"
                      height="20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      preserveAspectRatio="xMidYMid slice"
                      tabindex="0"
                    >
                      <rect width="100%" height="100%" fill="#007aff" />
                    </svg>

                    <strong class="me-auto">Bootstrap</strong>
                    <small class="text-muted">11 mins ago</small>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="toast"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="toast-body">
                    Hello, world! This is a toast message.
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article class="mt-3 mb-5 pb-5" id="tooltips">
            <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2">
              <h3>Tooltips</h3>
              <a
                class="d-flex align-items-center"
                href="../components/tooltips/"
              >
                Documentation
              </a>
            </div>

            <div>
              <div
                class="bd-example tooltip-demo"
                ref={(tooltip) =>
                  new bootstrap.Tooltip(tooltip, {
                    selector: '[data-bs-toggle="tooltip"]',
                  })
                }
              >
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Tooltip on top"
                >
                  Tooltip on top
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title="Tooltip on end"
                >
                  Tooltip on end
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Tooltip on bottom"
                >
                  Tooltip on bottom
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Tooltip on start"
                >
                  Tooltip on start
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-toggle="tooltip"
                  data-bs-html="true"
                  title="<em>Tooltip</em> <u>with</u> <b>HTML</b>"
                >
                  Tooltip with HTML
                </button>
              </div>
            </div>
          </article>
        </section>
      </div>

      <div
        class="modal fade"
        id="exampleModalDefault"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="staticBackdropLive"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLiveLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLiveLabel">
                Modal title
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>
                I will not close if you click outside me. Don't even try to
                press escape key.
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModalCenteredScrollable"
        tabindex="-1"
        aria-labelledby="exampleModalCenteredScrollableTitle"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenteredScrollableTitle">
                Modal title
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>
                Placeholder text for this demonstration of a vertically centered
                modal dialog.
              </p>
              <p>
                In this case, the dialog has a bit more content, just to show
                how vertical centering can be added to a scrollable modal.
              </p>
              <p>
                What follows is just some placeholder text for this modal
                dialog. Sipping on Rosé, Silver Lake sun, coming up all lazy.
                It’s in the palm of your hand now baby. So we hit the boulevard.
                So make a wish, I'll make it like your birthday everyday. Do you
                ever feel already buried deep six feet under? It's time to bring
                out the big balloons. You could've been the greatest. Passport
                stamps, she's cosmopolitan. Your kiss is cosmic, every move is
                magic.
              </p>
              <p>
                We're living the life. We're doing it right. Open up your heart.
                I was tryna hit it and quit it. Her love is like a drug. Always
                leaves a trail of stardust. The girl's a freak, she drive a jeep
                in Laguna Beach. Fine, fresh, fierce, we got it on lock. All my
                girls vintage Chanel baby.
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModalFullscreen"
        tabindex="-1"
        aria-labelledby="exampleModalFullscreenLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-fullscreen">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title h4" id="exampleModalFullscreenLabel">
                Full screen modal
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <p>
                What follows is just some placeholder text for this modal
                dialog. I feel like I'm already there. I’m gon’ put her in a
                coma. Boom, boom, boom. You're reading me like erotica, boy, you
                make me feel exotic, yeah. Happy birthday. From Tokyo to Mexico,
                to Rio. I knew you were.
              </p>
              <p>
                Last Friday night. Calling out my name. Kiss her, touch her,
                squeeze her buns. Heavy is the head that wears the crown. So
                open up your heart and just let it begin. Boy all this time was
                worth the waiting. You know that I'm the girl that you should
                call. End of the rainbow looking treasure. You're reading me
                like erotica, boy, you make me feel exotic, yeah. Do you know
                that there's still a chance for you 'Cause there's a spark in
                you? So I sat quietly, agreed politely. From Tokyo to Mexico, to
                Rio.
              </p>
              <p>
                Don't be a shy kinda guy I'll bet it's beautiful. You fall
                asleep during foreplay, 'Cause the pills you take, are more your
                forte. Open up your heart. You're never gonna be unsatisfied.
                Know that you are worthy. This one goes out to the ladies at
                breakfast in last night's dress. You think you've seen her in a
                magazine. I should've told you what you meant to me 'Cause now I
                pay the price. Takes you miles high, so high, 'cause she’s got
                that one international smile.
              </p>
              <p>
                Yo, shout out to all you kids, buying bottle service, with your
                rent money. So I sat quietly, agreed politely. They say, be
                afraid you're not like the others, futuristic lover. Boom, boom,
                boom. Don't need apologies. We can dance, until we die, you and
                I, will be young forever. If you choose to walk away, don’t walk
                away. You know that I'm the girl that you should call. This
                Friday night, do it all again.
              </p>
              <p>
                I'm walking on air. But lil' mama so dope. It's time to bring
                out the big balloons. Are you ready for, ready for. The boys
                break their necks try'na to creep a little sneak peek. Summer
                after high school when we first met. If you want it all. (This
                is how we do) You open my eyes and I'm ready to go, lead me into
                the light.
              </p>
              <p>
                Growing fast into a bolt of lightning. We freak in my jeep,
                Snoop Doggy Dogg on the stereo. Baby do you dare to do this?
                Open up your heart and just let it begin. Peach-pink lips, yeah,
                everybody stares. Be your teenage dream tonight. Are you brave
                enough to let me see your peacock? You think I'm funny when I
                tell the punchline wrong. Woo! I knew you were. All this money
                can't buy me a time machine. I can't sleep let's run away and
                don't ever look back, don't ever look back.
              </p>
              <p>
                Make it like your birthday everyday. I'm not sticking around to
                watch you go down. Uh-huh, I see you. For you I'll risk it all,
                all. I’m gon’ put her in a coma. She ride me like a roller
                coaster. You hear my voice, you hear that sound. 'Cause I will
                love you unconditionally (oh yeah). They say, be afraid you're
                not like the others, futuristic lover. There is no fear now, let
                go and just be free, I will love you unconditionally.
              </p>
              <p>
                We can dance, until we die, you and I, will be young forever.
                Pop your Pérignon. Last Friday night, yeah I think we broke the
                law, always say we're gonna stop. Don't need apologies. Give you
                something good to celebrate. But don’t make me your enemy, your
                enemy, your enemy. Flowers in her hair, she don't care. Tone,
                tan fit and ready, turn it up cause its gettin' heavy.
              </p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
