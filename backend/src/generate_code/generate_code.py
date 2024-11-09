import copy, itertools
from typing import List, Optional

from ..request_format.model import RequestElement


class GenerateCode:
    """
    Receives ``RequestElement`` and converts into executable Python code lines.

    Every generated code can be classified into four section regarding to their concern as the below.

    1. figure_definition: Defines variables for figure and axes of `pyplot.subplot`.
        ```
        fig, axes = plt.subplot(n, m)
        ```

    2. axes_definition: Assigns specific name for every used axes in subplot.
        ```
        axes_this = axes[0][0]
        axes_that = axes[0][1]
        ```

    3. data_definition: Defines variable for every data.
        ```
        data_x = [....]
        data_y = [....]
        ```

    4. plot_definition: Render every plots for given axes and data.
        ```
        axes_this.plot(data_x, data_y, style)
        ```

    Each section has its corresponding function, as `_generate_figure_lines`.
    To get complete code lines, call `GenerateCode.generate()`.
    Note that this class does NOT get any external variable except for ``RequestElement`` for ``__init__``.
    This means the behavior of this class solely depends on ``RequestElement``, including output format.

    Attributes:
        request (RequestElement): given request
        plot_to_axes (dict): internal variable. For fast [plot name -> list of plot-calling axes name] searching.
        axes_to_figure_idx (dict): internal variable. For fast [axes name -> figure index] searching.
    """

    CODE_HEADER_IMPORT = ["import numpy as np", "import matplotlib.pyplot as plt"]
    CODE_FOOTER_RENDER = ['fig.savefig("figure.png")']

    def __init__(self, request_model: RequestElement):
        self.request = request_model
        self.plot_to_axes = self._compile_plot_to_axes()
        self.axes_to_figure_idx = self._compile_axes_to_figure_idx()

    def _compile_plot_to_axes(self) -> dict[str, List[str]]:
        """
        Returns [plot name -> list of plot-calling axes name] dictionary.
        """
        plot_to_axes: dict[str, List[str]] = dict()

        # Make empty list for every plots
        for plot_element in self.request.plot:
            plot_to_axes[plot_element.name] = []

        # Fill each list for every axes which calls the plot.
        for plot_element, axes_element in itertools.product(
            self.request.plot, self.request.axes
        ):
            if plot_element.name in axes_element.plot:
                plot_to_axes[plot_element.name].append(axes_element.name)

        return plot_to_axes

    def _compile_axes_to_figure_idx(self) -> dict[str, Optional[tuple[int, int]]]:
        """
        Returns [axes name -> figure index] dictionary.
        Note that axes might NOT have its place in figure, then it will be resulted as comment.
        """
        axes_to_figure_idx: dict[str, Optional[tuple[int, int]]] = dict()
        row_size, column_size = (
            self.request.figure.size.row,
            self.request.figure.size.column,
        )

        for axes_element in self.request.axes:
            # Set Default None
            axes_to_figure_idx[axes_element.name] = None

            # Traverse row-column index, until find match with the axes name
            for row, column in itertools.product(range(row_size), range(column_size)):
                # If match found
                if self.request.figure.axes[row][column] == axes_element.name:
                    # Update dict with found (row, column)
                    axes_to_figure_idx[axes_element.name] = (row, column)
                    break

        return axes_to_figure_idx

    def _generate_figure_lines(self) -> List[str]:
        """
        Defines variables for figure and axes of `pyplot.subplot`.

        ```
        fig, axes = plt.subplot({row}, {column})
        ```
        """
        row, column = self.request.figure.size.row, self.request.figure.size.column
        return [f"fig, axes = plt.subplots({row}, {column})"]

    def _generate_axes_lines(self) -> List[str]:
        """
        Assigns specific name for every used axes in subplot.
        Note that axes might NOT have its place in figure, then it will be displayed as comment.
        ```
        axes_this = axes[0][0]
        axes_that = axes[0][1]
        ```
        """
        lines: List[str] = []

        # Traverse through every axes
        for axes_element in self.request.axes:
            axes_name = axes_element.name
            axes_index = self.axes_to_figure_idx[axes_name]
            if axes_index is not None:
                # axes will render
                row, column = axes_index
                lines.append(f"{axes_name} = axes[{row}][{column}]")
            else:
                # axes will NOT render (reason: axes never assigned to subplot)
                lines.append(
                    f"# {axes_name} = axes[?][?] # {axes_name} is not assigned into any subplot"
                )

        return lines

    def _generate_data_lines(self) -> List[str]:
        """
        Defines variable for every data.
        ```
        data_x = [....]
        data_y = [....]
        ```
        """
        lines: List[str] = []
        for data_element in self.request.data:
            lines.append(f"{data_element.name} = {data_element.value}")
        return lines

    def _generate_plot_lines(self) -> List[str]:
        """
        Render every plots for given axes and data.
        ```
        axes_this.plot(data_x, data_y, style)
        ```
        """
        lines: List[str] = []
        # Traverse every plot
        for plot_element in self.request.plot:
            plot_line = plot_element.to_code()
            axes_list = self.plot_to_axes[plot_element.name]
            # Each plot can be drawn into multiple axes, so traverse each axes
            # Note that if plot is never assigned to any axes, the loop will not be executed
            for axes_name in axes_list:
                if self.axes_to_figure_idx[axes_name] is not None:
                    # If assigned axes is rendered axes
                    lines.append(f"{axes_name}.{plot_line}")
                else:
                    # If assigned axes is not-rendered axes
                    lines.append(
                        f"# {axes_name}.{plot_line} # {axes_name} is not assigned into any subplot"
                    )
        return lines

    def _merge_as_function(self) -> List[str]:
        """
        Subfunction of ``self.generate``

        This method is executed when ``self.request.figure.style.code_is_function`` is True.
        Return the code as function form.
        """
        lines = []
        return self._merge_as_procedure()  # TODO

    def _merge_as_procedure(self) -> List[str]:
        """
        Subfunction of ``self.generate``.

        This method is executed when ``self.request.figure.style.code_is_function`` is False.
        Return the code as procedure form.
        """
        lines = []
        lines += self.__class__.CODE_HEADER_IMPORT
        lines.append("")

        lines.append(f"# Figure Definition")
        lines += self._generate_figure_lines()
        lines.append("")

        lines.append(f"# Axes Defintion")
        lines += self._generate_axes_lines()
        lines.append("")

        lines.append(f"# Data Definition")
        lines += self._generate_data_lines()
        lines.append("")

        lines.append(f"# Plot Definition")
        lines += self._generate_plot_lines()
        lines.append("")

        lines.append(f"# Render")
        lines += self.__class__.CODE_FOOTER_RENDER
        lines.append("")

        return "\n".join(lines)

    def generate(self) -> List[str]:
        """
        Receives ``RequestElement`` and converts into executable Python code lines.
        """
        if self.request.figure.style.code_is_function:
            return self._merge_as_function()
        return self._merge_as_procedure()

    @staticmethod
    def indent_lines(code_lines: List[str], indent_level: int, indent_style: str):
        """
        Indent the given code lines with the specified indent level and style.

        Args:
            code_lines (List[str]): The code lines to be indented.
            indent_level (int): The indentation level. Note that this does NOT mean the number of space characters.
                For space characters, each indentation level equals four spaces, meaning " " * 4.
            indent_style (str): The indentation style. "space" for four-space indent, and "tab" for tab indent.
                Any other value raises a ValueError.

        Returns:
            List[str]: Indented code lines.

        Raises:
            ValueError: If `indent_style` is invalid, i.e., not "tab" or "space".

        Example:
            >>> indent_lines(["a = 3 + 4", "b = a + 7"], indent_level=1, indent_style="space")
            ["    a = 3 + 4", "    b = a + 7"]
        """
        if indent_style == "space":
            space_indent = " " * 4 * indent_level
            return [space_indent + line for line in code_lines]
        elif indent_style == "tab":
            tab_indent = "\t" * indent_level
            return [tab_indent + line for line in code_lines]
        else:
            raise ValueError(f"Invalid indentation style: {indent_style}")
