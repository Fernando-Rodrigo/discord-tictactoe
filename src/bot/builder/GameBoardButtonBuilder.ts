import GameBoardBuilder from '@bot/builder/GameBoardBuilder';
import Entity from '@tictactoe/Entity';
import { Player } from '@tictactoe/Player';
import { ActionRowBuilder, BaseMessageOptions, ButtonBuilder, ButtonStyle } from 'discord.js';

/**
 * Builds representation of a game board using buttons
 * whiches will be displayed in a Discord message.
 *
 * @author Utarwyn
 * @since 3.0.0
 */
export default class GameBoardButtonBuilder extends GameBoardBuilder {
    /**
     * Default labels used on buttons if emojies are not enabled.
     * @protected
     */
    private buttonLabels = ['X', 'O'];
    /**
     * Button styles used for representing the two players.
     * @private
     */
    private buttonStyles: ButtonStyle[] = [
        ButtonStyle.Secondary,
        ButtonStyle.Primary,
        ButtonStyle.Danger
    ];
    /**
     * Stores if emojies have been customized.
     * @private
     */
    private customEmojies = false;
    /**
     * Should disable buttons after been used.
     * @private
     */
    private disableButtonsAfterUsed = false;
    /**
     * Stores if game has ended or not.
     * @protected
     */
    private gameEnded = false;

    /**
     * Should disable buttons after been used.
     *
     * @returns same instance
     */
    public withButtonsDisabledAfterUse(): GameBoardBuilder {
        this.disableButtonsAfterUsed = true;
        return this;
    }

    /**
     * @inheritdoc
     * @override
     */
    override withEntityPlaying(entity?: Entity): GameBoardBuilder {
        // Do not display state if game is loading
        if (entity) {
            return super.withEntityPlaying(entity);
        } else {
            return this;
        }
    }

    /**
     * @inheritdoc
     * @override
     */
    override withEndingMessage(winner?: Entity): GameBoardBuilder {
        this.gameEnded = true;
        return super.withEndingMessage(winner);
    }

    /**
     * @inheritdoc
     * @override
     */
    override withEmojies(first: string, second: string): GameBoardBuilder {
        this.customEmojies = true;
        return super.withEmojies(first, second);
    }

    /**
     * @inheritdoc
     * @override
     */
    override toMessageOptions(): BaseMessageOptions {
        return {
            content: this.title + this.state,
            components: [...Array(this.boardSize).keys()].map(row =>
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    [...Array(this.boardSize).keys()].map(col => this.createButton(row, col))
                )
            )
        };
    }

    /**
     * Creates a button to be displayed based on current game context.
     *
     * @param row button placement row
     * @param col button placement column
     * @returns button discord.js object
     */
    private createButton(row: number, col: number): ButtonBuilder {
        const button = new ButtonBuilder();
        const buttonIndex = row * this.boardSize + col;
        const buttonData = this.boardData[buttonIndex];

        if (buttonData !== Player.None) {
            if (this.customEmojies) {
                button.setEmoji(this.emojies[buttonData]);
            } else {
                button.setLabel(this.buttonLabels[buttonData - 1]);
            }

            if (this.disableButtonsAfterUsed) {
                button.setDisabled(true);
            }
        } else {
            button.setLabel(' ');

            if (this.gameEnded && this.disableButtonsAfterUsed) {
                button.setDisabled(true);
            }
        }

        return button.setCustomId(buttonIndex.toString()).setStyle(this.buttonStyles[buttonData]);
    }
}
